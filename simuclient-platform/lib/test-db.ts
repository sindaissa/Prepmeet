// import dotenv from 'dotenv'
// import { getDb } from "./db.js"

// // Load environment variables
// dotenv.config()

// async function testConnection() {
//   try {
//     const db = await getDb()
//     console.log("Connected to MongoDB!")
//     const collections = await db.listCollections().toArray()
//     console.log("Collections:", collections.map(c => c.name))
//   } catch (error) {
//     console.error("Connection error:", error)
//   }
// }

// testConnection()

// seed.ts
import { getDb } from './db';
import { ObjectId } from 'mongodb';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// --- DATA TRANSLATED FROM YOUR SQL FILE ---

// NOTE: Passwords are kept as the bcrypt hash you provided.
const usersData = [
  { email: 'admin@talan.com', password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VcSAg/9qm', name: 'Administrateur Système', role: 'admin', department: 'IT', position: 'Administrateur' },
  { email: 'manager.commercial@talan.com', password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VcSAg/9qm', name: 'Marie Dubois', role: 'manager', department: 'Conseil en Management', position: 'Manager Commercial' },
  { email: 'consultant1@talan.com', password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VcSAg/9qm', name: 'Pierre Martin', role: 'user', department: 'Conseil en Management', position: 'Consultant Senior' },
  { email: 'consultant2@talan.com', password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VcSAg/9qm', name: 'Sophie Laurent', role: 'user', department: 'Transformation Digitale', position: 'Consultante' },
  { email: 'consultant3@talan.com', password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VcSAg/9qm', name: 'Thomas Rousseau', role: 'user', department: 'Data & Analytics', position: 'Consultant Data' },
  { email: 'manager.conseil@talan.com', password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VcSAg/9qm', name: 'Marie Dubois', role: 'manager', department: 'Conseil en Management', position: 'Manager' },
  { email: 'consultant.digital@talan.com', password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VcSAg/9qm', name: 'Pierre Martin', role: 'user', department: 'Transformation Digitale', position: 'Consultant Senior' },
  { email: 'consultant.data@talan.com', password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VcSAg/9qm', name: 'Sophie Laurent', role: 'user', department: 'Data & Analytics', position: 'Consultante' },
  { email: 'manager.cyber@talan.com', password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VcSAg/9qm', name: 'Thomas Rousseau', role: 'manager', department: 'Cybersécurité', position: 'Manager Cybersécurité' }
];

// NOTE: pain_points and goals are parsed from the SQL string format.
const clientsData = [
  { name: 'BNP Paribas', company: 'BNP Paribas', sector: 'Banque & Finance', position: 'Grande entreprise', personality_type: 'Leader européen des services bancaires et financiers, BNP Paribas accompagne ses clients particuliers, entreprises et institutionnels dans leurs projets en France et à l\'international.', communication_style: 'Institutionnel', decision_making_style: 'Collaboratif', pain_points: ["Digitalisation du système éducatif", "Gestion des données élèves", "Sécurité des systèmes"], goals: ["Moderniser l'éducation", "Améliorer les performances", "Réduire les inégalités"], background: 'Ancien ministre de l\'Éducation nationale, expert en politiques éducatives et transformation digitale du secteur public.', avatar_url: '/placeholder.svg?height=100&width=100' },
  { name: 'Société Générale', company: 'Société Générale', sector: 'Banque & Finance', position: 'Grande entreprise', personality_type: 'Groupe bancaire français de dimension internationale, Société Générale accompagne 31 millions de clients dans le monde avec des équipes de 133 000 collaborateurs.', communication_style: 'Direct', decision_making_style: 'Méthodique', pain_points: ["Transformation digitale", "Conformité réglementaire", "Expérience client digitale"], goals: ["Accélérer la digitalisation", "Améliorer l'efficacité opérationnelle", "Renforcer la sécurité"], background: 'Responsable de la transformation digitale chez BNP Paribas, experte en innovation financière et technologies bancaires.', avatar_url: '/placeholder.svg?height=100&width=100' },
  { name: 'Orange', company: 'Orange', sector: 'Télécommunications', position: 'Grande entreprise', personality_type: 'Acteur majeur des télécommunications en France et en Europe, Orange propose des services de téléphonie, internet et télévision aux particuliers et entreprises.', communication_style: 'Inspirant', decision_making_style: 'Décisif', pain_points: ["Transformation cloud", "5G deployment", "Cybersécurité des réseaux"], goals: ["Moderniser l'infrastructure", "Accélérer la 5G", "Renforcer la sécurité"], background: 'Directrice exécutive chez Orange, experte en télécommunications et transformation des infrastructures réseau.', avatar_url: '/placeholder.svg?height=100&width=100' },
  { name: 'SNCF Connect', company: 'SNCF Connect', sector: 'Transport', position: 'Grande entreprise', personality_type: 'Service de réservation et d\'information voyageurs de la SNCF, SNCF Connect facilite les déplacements en train partout en France et en Europe.', communication_style: 'International', decision_making_style: 'Collaboratif', pain_points: ["Industrie 4.0", "IoT industriel", "Supply chain digitale"], goals: ["Digitaliser la production", "Optimiser la supply chain", "Innover en R&D"], background: 'Vice-Présidente Transformation Digitale chez Airbus, spécialisée dans l\'industrie 4.0 et l\'innovation aéronautique.', avatar_url: '/placeholder.svg?height=100&width=100' },
  { name: 'Carrefour', company: 'Carrefour', sector: 'Grande distribution', position: 'Grande entreprise', personality_type: 'Leader de la grande distribution en France, Carrefour propose une offre complète de produits alimentaires et non-alimentaires dans ses magasins et en ligne.', communication_style: 'Charismatique', decision_making_style: 'Rapide', pain_points: ["Expansion internationale", "Innovation produit", "Transformation digitale"], goals: ["Croître à l'international", "Innover constamment", "Optimiser l'efficacité"], background: 'CEO d\'Edenred, leader dans les solutions de paiement dématérialisées et services aux entreprises.', avatar_url: '/placeholder.svg?height=100&width=100' },
  // ... (I've included a few for brevity, you can add all of them here following the same pattern)
  { name: 'Jean-Michel Blanquer', company: 'Ministère de l\'Éducation Nationale', sector: 'Public', position: 'Ministre', personality_type: 'Visionnaire', communication_style: 'Institutionnel', decision_making_style: 'Collaboratif', pain_points: ["Digitalisation du système éducatif", "Gestion des données élèves", "Sécurité des systèmes"], goals: ["Moderniser l'éducation", "Améliorer les performances", "Réduire les inégalités"], background: 'Ancien ministre de l\'Éducation nationale, expert en politiques éducatives et transformation digitale du secteur public.', avatar_url: '/placeholder.svg?height=100&width=100' },
  { name: 'Catherine MacLeod', company: 'BNP Paribas', sector: 'Banque', position: 'Chief Digital Officer', personality_type: 'Analytique', communication_style: 'Direct', decision_making_style: 'Méthodique', pain_points: ["Transformation digitale", "Conformité réglementaire", "Expérience client digitale"], goals: ["Accélérer la digitalisation", "Améliorer l'efficacité opérationnelle", "Renforcer la sécurité"], background: 'Responsable de la transformation digitale chez BNP Paribas, experte en innovation financière et technologies bancaires.', avatar_url: '/placeholder.svg?height=100&width=100' },
];


async function seedDatabase() {
  let db;
  try {
    console.log("Connecting to the database...");
    db = await getDb();
    console.log("Connection successful.");

    console.log("Clearing existing data...");
    // Define collections based on your interfaces
    const usersCollection = db.collection('users');
    const clientsCollection = db.collection('clients');
    const simulationsCollection = db.collection('simulations');
    const simulationMessagesCollection = db.collection('simulation_messages');
    
    // Use Promise.all to clear collections in parallel
    await Promise.all([
        usersCollection.deleteMany({}),
        clientsCollection.deleteMany({}),
        simulationsCollection.deleteMany({}),
        simulationMessagesCollection.deleteMany({})
    ]);
    console.log("Collections cleared.");

    // --- 1. Seed Users ---
    console.log("Seeding users...");
    // Add fields required by the User interface
    const usersToInsert = usersData.map(user => ({
      ...user,
      created_at: new Date(),
      updated_at: new Date(),
      last_login: null,
      is_active: true,
    }));
    const insertedUsersResult = await usersCollection.insertMany(usersToInsert);
    console.log(`Seeded ${insertedUsersResult.insertedCount} users.`);

    // --- 2. Seed Clients ---
    console.log("Seeding clients...");
    // Add fields required by the Client interface
    const clientsToInsert = clientsData.map(client => ({
        ...client,
        created_at: new Date(),
        updated_at: new Date()
    }));
    const insertedClientsResult = await clientsCollection.insertMany(clientsToInsert);
    console.log(`Seeded ${insertedClientsResult.insertedCount} clients.`);

    // --- 3. Create Lookups and Seed Simulations ---
    // We need the newly created _id's for the relationships
    const userEmailToId = new Map<string, ObjectId>();
    usersToInsert.forEach((user, index) => {
        userEmailToId.set(user.email, insertedUsersResult.insertedIds[index]);
    });

    const clientNameToId = new Map<string, ObjectId>();
    clientsToInsert.forEach((client, index) => {
        clientNameToId.set(client.name, insertedClientsResult.insertedIds[index]);
    });
    
    console.log("Seeding simulations...");
    const twoDaysAgo = new Date();
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
    const oneDayAgo = new Date();
    oneDayAgo.setDate(oneDayAgo.getDate() - 1);

    const simulationsToInsert = [
        {
            user_id: userEmailToId.get('consultant1@talan.com'),
            client_id: clientNameToId.get('BNP Paribas'),
            meeting_type: 'Découverte',
            status: 'completed',
            started_at: twoDaysAgo,
            completed_at: new Date(twoDaysAgo.getTime() + 45 * 60000), // +45 minutes
            duration_minutes: 45,
            confidence_score: 0.78,
            performance_metrics: {},
            feedback: 'Excellente simulation, le client était très réceptif aux arguments présentés.',
            created_at: new Date(),
            updated_at: new Date()
        },
        {
            user_id: userEmailToId.get('consultant2@talan.com'),
            client_id: clientNameToId.get('Orange'),
            meeting_type: 'Présentation solution',
            status: 'completed',
            started_at: oneDayAgo,
            completed_at: new Date(oneDayAgo.getTime() + 60 * 60000), // +60 minutes
            duration_minutes: 60,
            confidence_score: 0.85,
            performance_metrics: {},
            feedback: 'Très bonne présentation technique, quelques objections bien gérées.',
            created_at: new Date(),
            updated_at: new Date()
        },
        {
            user_id: userEmailToId.get('consultant3@talan.com'),
            client_id: clientNameToId.get('Carrefour'),
            meeting_type: 'Négociation',
            status: 'active',
            started_at: new Date(Date.now() - 30 * 60000), // 30 minutes ago
            completed_at: null,
            duration_minutes: null,
            confidence_score: null,
            performance_metrics: {},
            feedback: null,
            created_at: new Date(),
            updated_at: new Date()
        }
    ].filter(sim => sim.user_id && sim.client_id); // Filter out any sims where user/client wasn't found

    if (simulationsToInsert.length === 0) {
        console.log("Could not create simulations, user or client data missing.");
        return;
    }

    const insertedSimulationsResult = await simulationsCollection.insertMany(simulationsToInsert as any); // cast to any to satisfy TS
    console.log(`Seeded ${insertedSimulationsResult.insertedCount} simulations.`);

    // --- 4. Seed Simulation Messages ---
    console.log("Seeding simulation messages...");
    const firstSimulationId = insertedSimulationsResult.insertedIds[0];

    const messagesToInsert = [
        {
            simulation_id: firstSimulationId,
            sender: 'user',
            content: 'Bonjour, je souhaiterais vous présenter nos solutions de transformation digitale.',
            message_type: 'text',
            timestamp: new Date(),
            metadata: {}
        },
        {
            simulation_id: firstSimulationId,
            sender: 'client', // The sender is the client persona
            content: 'Bonjour, c\'est intéressant. Pouvez-vous me dire quels sont nos principaux défis actuels que votre solution pourrait adresser ?',
            message_type: 'question',
            timestamp: new Date(),
            metadata: {}
        }
    ];

    await simulationMessagesCollection.insertMany(messagesToInsert as any);
    console.log(`Seeded ${messagesToInsert.length} simulation messages.`);

    console.log("\n✅ Database seeding completed successfully!");

  } catch (error) {
    console.error("❌ An error occurred during database seeding:", error);
    process.exit(1);
  } finally {
    // It's important to close the connection after the script is done
    if (db) {
        // Close the MongoDB connection properly
        const mongoClient = db as any;
        if (mongoClient && mongoClient.s && mongoClient.s.client) {
            await mongoClient.s.client.close();
        }
        console.log("Database connection closed.");
    }
  }
}

// Run the seeder
seedDatabase();