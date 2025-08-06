import { sql } from "./db"

export interface PlatformAnalytics {
  totalUsers: number
  activeUsers: number
  totalSimulations: number
  completedSimulations: number
  averageConfidenceScore: number
  averageSessionDuration: number
  topPerformers: any[]
  recentActivity: any[]
}

export interface UserAnalytics {
  totalSimulations: number
  completedSimulations: number
  averageConfidenceScore: number
  averageSessionDuration: number
  improvementTrend: number
  strongPoints: string[]
  areasForImprovement: string[]
  recentPerformance: any[]
}

export interface ManagerAnalytics {
  teamSize: number
  teamPerformance: any[]
  needsAttention: any[]
  topPerformers: any[]
  departmentStats: any
}

export class AnalyticsService {
  // Analytics globales de la plateforme
  static async getPlatformAnalytics(): Promise<PlatformAnalytics> {
    try {
      // Statistiques utilisateurs
      const userStats = await sql`
        SELECT 
          COUNT(*) as total_users,
          COUNT(CASE WHEN last_login > NOW() - INTERVAL '30 days' THEN 1 END) as active_users
        FROM users 
        WHERE is_active = true
      `

      // Statistiques simulations
      const simulationStats = await sql`
        SELECT 
          COUNT(*) as total_simulations,
          COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_simulations,
          AVG(confidence_score) as avg_confidence_score,
          AVG(duration_minutes) as avg_duration_minutes
        FROM simulations
      `

      // Top performers
      const topPerformers = await sql`
        SELECT 
          u.name, 
          u.department,
          AVG(s.confidence_score) as avg_score,
          COUNT(s.id) as simulation_count
        FROM users u
        JOIN simulations s ON u.id = s.user_id
        WHERE s.status = 'completed' AND s.confidence_score IS NOT NULL
        GROUP BY u.id, u.name, u.department
        HAVING COUNT(s.id) >= 3
        ORDER BY avg_score DESC
        LIMIT 10
      `

      // Activité récente
      const recentActivity = await sql`
        SELECT 
          u.name as user_name,
          c.name as client_name,
          s.meeting_type,
          s.confidence_score,
          s.completed_at
        FROM simulations s
        JOIN users u ON s.user_id = u.id
        JOIN clients c ON s.client_id = c.id
        WHERE s.status = 'completed'
        ORDER BY s.completed_at DESC
        LIMIT 20
      `

      return {
        totalUsers: Number.parseInt(userStats[0].total_users),
        activeUsers: Number.parseInt(userStats[0].active_users),
        totalSimulations: Number.parseInt(simulationStats[0].total_simulations),
        completedSimulations: Number.parseInt(simulationStats[0].completed_simulations),
        averageConfidenceScore: Number.parseFloat(simulationStats[0].avg_confidence_score) || 0,
        averageSessionDuration: Number.parseFloat(simulationStats[0].avg_duration_minutes) || 0,
        topPerformers,
        recentActivity,
      }
    } catch (error) {
      console.error("Erreur analytics plateforme:", error)
      return {
        totalUsers: 0,
        activeUsers: 0,
        totalSimulations: 0,
        completedSimulations: 0,
        averageConfidenceScore: 0,
        averageSessionDuration: 0,
        topPerformers: [],
        recentActivity: [],
      }
    }
  }

  // Analytics utilisateur individuel
  static async getUserAnalytics(userId: string): Promise<UserAnalytics> {
    try {
      // Statistiques de base
      const baseStats = await sql`
        SELECT 
          COUNT(*) as total_simulations,
          COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_simulations,
          AVG(confidence_score) as avg_confidence_score,
          AVG(duration_minutes) as avg_duration_minutes
        FROM simulations
        WHERE user_id = ${userId}
      `

      // Tendance d'amélioration (comparaison 30 derniers jours vs 30 jours précédents)
      const improvementTrend = await sql`
        WITH recent_performance AS (
          SELECT AVG(confidence_score) as recent_avg
          FROM simulations
          WHERE user_id = ${userId} 
          AND completed_at > NOW() - INTERVAL '30 days'
          AND status = 'completed'
        ),
        previous_performance AS (
          SELECT AVG(confidence_score) as previous_avg
          FROM simulations
          WHERE user_id = ${userId}
          AND completed_at BETWEEN NOW() - INTERVAL '60 days' AND NOW() - INTERVAL '30 days'
          AND status = 'completed'
        )
        SELECT 
          COALESCE(r.recent_avg, 0) - COALESCE(p.previous_avg, 0) as improvement
        FROM recent_performance r, previous_performance p
      `

      // Performance récente
      const recentPerformance = await sql`
        SELECT 
          c.name as client_name,
          s.meeting_type,
          s.confidence_score,
          s.duration_minutes,
          s.completed_at
        FROM simulations s
        JOIN clients c ON s.client_id = c.id
        WHERE s.user_id = ${userId} AND s.status = 'completed'
        ORDER BY s.completed_at DESC
        LIMIT 10
      `

      return {
        totalSimulations: Number.parseInt(baseStats[0].total_simulations),
        completedSimulations: Number.parseInt(baseStats[0].completed_simulations),
        averageConfidenceScore: Number.parseFloat(baseStats[0].avg_confidence_score) || 0,
        averageSessionDuration: Number.parseFloat(baseStats[0].avg_duration_minutes) || 0,
        improvementTrend: Number.parseFloat(improvementTrend[0]?.improvement) || 0,
        strongPoints: ["Communication", "Écoute active"], // À implémenter avec plus de logique
        areasForImprovement: ["Gestion des objections", "Closing"], // À implémenter avec plus de logique
        recentPerformance,
      }
    } catch (error) {
      console.error("Erreur analytics utilisateur:", error)
      return {
        totalSimulations: 0,
        completedSimulations: 0,
        averageConfidenceScore: 0,
        averageSessionDuration: 0,
        improvementTrend: 0,
        strongPoints: [],
        areasForImprovement: [],
        recentPerformance: [],
      }
    }
  }

  // Analytics pour les managers
  static async getManagerAnalytics(department: string): Promise<ManagerAnalytics> {
    try {
      // Taille de l'équipe
      const teamSize = await sql`
        SELECT COUNT(*) as team_size
        FROM users
        WHERE department = ${department} AND is_active = true
      `

      // Performance de l'équipe
      const teamPerformance = await sql`
        SELECT 
          u.name,
          u.position,
          COUNT(s.id) as simulation_count,
          AVG(s.confidence_score) as avg_score,
          MAX(s.completed_at) as last_simulation
        FROM users u
        LEFT JOIN simulations s ON u.id = s.user_id AND s.status = 'completed'
        WHERE u.department = ${department} AND u.is_active = true
        GROUP BY u.id, u.name, u.position
        ORDER BY avg_score DESC NULLS LAST
      `

      // Utilisateurs nécessitant attention
      const needsAttention = await sql`
        SELECT 
          u.name,
          u.position,
          COUNT(s.id) as simulation_count,
          AVG(s.confidence_score) as avg_score,
          MAX(s.completed_at) as last_simulation
        FROM users u
        LEFT JOIN simulations s ON u.id = s.user_id AND s.status = 'completed'
        WHERE u.department = ${department} AND u.is_active = true
        GROUP BY u.id, u.name, u.position
        HAVING COUNT(s.id) < 3 OR AVG(s.confidence_score) < 60 OR MAX(s.completed_at) < NOW() - INTERVAL '14 days'
        ORDER BY avg_score ASC NULLS FIRST
      `

      // Top performers du département
      const topPerformers = await sql`
        SELECT 
          u.name,
          u.position,
          COUNT(s.id) as simulation_count,
          AVG(s.confidence_score) as avg_score
        FROM users u
        JOIN simulations s ON u.id = s.user_id AND s.status = 'completed'
        WHERE u.department = ${department} AND u.is_active = true
        GROUP BY u.id, u.name, u.position
        HAVING COUNT(s.id) >= 5
        ORDER BY avg_score DESC
        LIMIT 5
      `

      return {
        teamSize: Number.parseInt(teamSize[0].team_size),
        teamPerformance,
        needsAttention,
        topPerformers,
        departmentStats: {
          averageScore:
            teamPerformance.reduce((acc, member) => acc + (Number.parseFloat(member.avg_score) || 0), 0) /
            teamPerformance.length,
          totalSimulations: teamPerformance.reduce((acc, member) => acc + Number.parseInt(member.simulation_count), 0),
        },
      }
    } catch (error) {
      console.error("Erreur analytics manager:", error)
      return {
        teamSize: 0,
        teamPerformance: [],
        needsAttention: [],
        topPerformers: [],
        departmentStats: {
          averageScore: 0,
          totalSimulations: 0,
        },
      }
    }
  }
}
