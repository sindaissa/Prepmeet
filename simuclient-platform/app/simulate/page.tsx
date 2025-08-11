"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Slider } from "@/components/ui/slider"
import {
  Mic,
  MicOff,
  Pause,
  Play,
  Square,
  Volume2,
  VolumeX,
  Brain,
  Heart,
  Zap,
  Camera,
  CameraOff,
  Settings,
  Maximize,
  ArrowLeft,
} from "lucide-react"

// Types pour la simulation
interface Message {
  id: number
  speaker: "user" | "ai"
  text: string
  timestamp: string
  audioUrl?: string
}

interface EmotionState {
  stress: number
  confidence: number
  engagement: number
  energy: number
}

interface AIResponse {
  text: string
  emotion: "neutral" | "happy" | "concerned" | "excited" | "thinking"
  gesture: "none" | "pointing" | "nodding" | "explaining" | "listening"
}

const clientsData = {
  millesimal: { name: "MILLÉSIMAL", logo: "🍷", contact: "Hortense Bernard - Directrice Marketing" },
  altyn: { name: "ALTYN", logo: "🏢", contact: "Sophie Lapierre - Directrice Communication" },
  bouygues: { name: "Bouygues Telecom", logo: "📱", contact: "William Boutet - Responsable Partenariats" },
  bpi: { name: "BPI France", logo: "🏦", contact: "Nicolas Parpex - Directeur French Touch Capital" },
  distalmotion: { name: "Distalmotion", logo: "🤖", contact: "Dr. Laurent Benoit - R&D Director" },
  loreal: { name: "L'Oréal", logo: "💄", contact: "Marie Dubois - Digital Innovation Manager" },
}

const meetingTypes = {
  decouverte: { name: "Découverte", icon: "🔍" },
  presentation: { name: "Présentation", icon: "📊" },
  negociation: { name: "Négociation", icon: "🤝" },
  crise: { name: "Gestion de crise", icon: "🚨" },
  suivi: { name: "Suivi projet", icon: "📋" },
  comite: { name: "Comité de décision", icon: "👥" },
}

export default function Simulate() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const animationFrameRef = useRef<number>()

  // États de la simulation
  const [user, setUser] = useState<any>(null)
  const [isRecording, setIsRecording] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [isVideoEnabled, setIsVideoEnabled] = useState(true)
  const [isAudioEnabled, setIsAudioEnabled] = useState(true)
  const [simulationTime, setSimulationTime] = useState(0)
  const [volumeLevel, setVolumeLevel] = useState(0)
  const [messages, setMessages] = useState<Message[]>([])
  const [currentAIResponse, setCurrentAIResponse] = useState<AIResponse | null>(null)
  const [emotions, setEmotions] = useState<EmotionState>({
    stress: 25,
    confidence: 75,
    engagement: 80,
    energy: 70,
  })

  // États de l'avatar IA
  const [avatarEmotion, setAvatarEmotion] = useState<"neutral" | "happy" | "concerned" | "excited" | "thinking">(
    "neutral",
  )
  const [avatarSpeaking, setAvatarSpeaking] = useState(false)
  const [avatarVolume, setAvatarVolume] = useState([75])

  // Paramètres de la simulation
  const clientId = searchParams?.get("client") || ""
  const meetingTypeId = searchParams?.get("type") || ""

  const client = clientsData[clientId as keyof typeof clientsData]
  const meetingType = meetingTypes[meetingTypeId as keyof typeof meetingTypes]

  // Questions IA contextuelles par client et type de réunion
  const aiQuestions = {
    millesimal: {
      decouverte: [
        "Bonjour ! Je suis Hortense Bernard, Directrice Marketing chez MILLÉSIMAL. Ravi de vous rencontrer. Comment Talan peut-il nous accompagner dans notre croissance digitale ?",
        "Nous avons 2,5 millions de bouteilles en stock et 234 000 références. Comment gérez-vous ce type de volumétrie ?",
        "Notre collaboration précédente avec Talan sur l'IA prédictive a été un succès. Quelles nouvelles innovations proposez-vous ?",
        "Nous nous développons à l'international, notamment aux USA. Avez-vous de l'expérience sur ces marchés ?",
      ],
      negociation: [
        "Votre proposition est intéressante, mais le budget me semble élevé pour une PME comme nous...",
        "SQLI nous a proposé 30% moins cher pour un projet similaire. Pouvez-vous vous aligner ?",
        "Quelles garanties pouvez-vous nous donner sur les délais ? Notre ouverture à New York ne peut pas attendre.",
        "Pouvons-nous échelonner les paiements sur 18 mois comme notre précédent projet ?",
      ],
    },
    bpi: {
      decouverte: [
        "Bonjour, Nicolas Parpex, Directeur French Touch Capital chez Bpifrance. Comment Talan accompagne-t-elle l'écosystème startup français ?",
        "Nous injectons 63 milliards d'euros par an dans l'économie. Quelle est votre vision de l'innovation française ?",
        "Nos secteurs prioritaires sont la santé, cybersécurité, défense. Quelles sont vos expertises sur ces domaines ?",
        "Comment Talan contribue-t-elle au Plan IA et à la souveraineté numérique française ?",
      ],
      comite: [
        "Présentez-nous votre stratégie pour accompagner nos 50 implantations régionales.",
        "Quel ROI pouvez-vous garantir sur un investissement de cette ampleur ?",
        "Comment votre solution s'intègre-t-elle avec nos partenaires bancaires existants ?",
        "Quels sont vos références sur des projets d'envergure nationale similaires ?",
      ],
    },
    bouygues: {
      presentation: [
        "William Boutet, Responsable Partenariats. Présentez-nous votre solution pour optimiser notre réseau 5G.",
        "Nous avons 10 000 conseillers et 500 boutiques. Comment gérez-vous cette échelle ?",
        "Comment votre solution s'intègre-t-elle avec nos partenaires Samsung, Apple, Google ?",
        "Quels sont les bénéfices concrets pour l'expérience de nos 15 millions de clients ?",
      ],
      crise: [
        "Nous avons un problème majeur ! Notre nouveau système plante depuis 3 jours !",
        "Nos 10 000 conseillers ne peuvent plus travailler correctement !",
        "Cette panne nous coûte des millions d'euros par jour !",
        "Comment comptez-vous résoudre ce problème rapidement ?",
      ],
    },
  }

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/auth/signin")
      return
    }
    setUser(JSON.parse(userData))
  }, [router])

  // Initialisation de la caméra et du micro
  const initializeMedia = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: isVideoEnabled,
        audio: isAudioEnabled,
      })

      streamRef.current = stream

      if (videoRef.current && isVideoEnabled) {
        videoRef.current.srcObject = stream
      }

      // Configuration de l'analyse audio
      if (isAudioEnabled) {
        audioContextRef.current = new AudioContext()
        analyserRef.current = audioContextRef.current.createAnalyser()
        const source = audioContextRef.current.createMediaStreamSource(stream)
        source.connect(analyserRef.current)
        analyserRef.current.fftSize = 256

        // Démarrer l'analyse du volume
        analyzeAudio()
      }
    } catch (error) {
      console.error("Erreur accès média:", error)
    }
  }, [isVideoEnabled, isAudioEnabled])

  // Analyse du volume audio en temps réel
  const analyzeAudio = useCallback(() => {
    if (!analyserRef.current) return

    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount)

    const analyze = () => {
      if (!analyserRef.current) return

      analyserRef.current.getByteFrequencyData(dataArray)
      const average = dataArray.reduce((a, b) => a + b) / dataArray.length
      const normalizedVolume = (average / 255) * 100

      setVolumeLevel(normalizedVolume)

      // Simulation d'analyse émotionnelle basée sur le volume et la fréquence
      setEmotions((prev) => ({
        stress: Math.max(0, Math.min(100, prev.stress + (normalizedVolume > 50 ? 2 : -1))),
        confidence: Math.max(
          0,
          Math.min(100, prev.confidence + (normalizedVolume > 30 && normalizedVolume < 70 ? 1 : -0.5)),
        ),
        engagement: Math.max(0, Math.min(100, prev.engagement + (normalizedVolume > 20 ? 0.5 : -1))),
        energy: Math.max(0, Math.min(100, normalizedVolume * 1.2)),
      }))

      animationFrameRef.current = requestAnimationFrame(analyze)
    }

    analyze()
  }, [])

  // Génération de réponse IA contextuelle
  const generateAIResponse = useCallback(
    async (userInput?: string): Promise<AIResponse> => {
      // Simulation d'un délai de traitement IA
      await new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 2000))

      const clientQuestions = aiQuestions[clientId as keyof typeof aiQuestions]
      const meetingQuestions = clientQuestions?.[meetingTypeId as keyof typeof clientQuestions] || [
        "Pouvez-vous me parler de votre expérience avec Talan ?",
        "Quels sont vos objectifs pour ce projet ?",
        "Comment mesurez-vous le succès de ce type d'initiative ?",
      ]

      const randomQuestion = meetingQuestions[Math.floor(Math.random() * meetingQuestions.length)]

      // Déterminer l'émotion et le geste basés sur le type de réunion et le client
      let emotion: AIResponse["emotion"] = "neutral"
      let gesture: AIResponse["gesture"] = "none"

      switch (meetingTypeId) {
        case "crise":
          emotion = Math.random() > 0.5 ? "concerned" : "neutral"
          gesture = "explaining"
          break
        case "negociation":
          emotion = Math.random() > 0.7 ? "thinking" : "neutral"
          gesture = "pointing"
          break
        case "presentation":
          emotion = "happy"
          gesture = "explaining"
          break
        case "comite":
          emotion = "neutral"
          gesture = "listening"
          break
        default:
          emotion = "neutral"
          gesture = "listening"
      }

      return {
        text: randomQuestion,
        emotion,
        gesture,
      }
    },
    [clientId, meetingTypeId],
  )

  // Synthèse vocale pour l'avatar
  const speakText = useCallback(
    (text: string) => {
      if ("speechSynthesis" in window) {
        const utterance = new SpeechSynthesisUtterance(text)
        utterance.lang = "fr-FR"
        utterance.rate = 0.9
        utterance.pitch = 1.1
        utterance.volume = avatarVolume[0] / 100

        utterance.onstart = () => setAvatarSpeaking(true)
        utterance.onend = () => setAvatarSpeaking(false)

        speechSynthesis.speak(utterance)
      }
    },
    [avatarVolume],
  )

  // Démarrer la simulation
  const startSimulation = useCallback(async () => {
    setIsRecording(true)
    await initializeMedia()

    // Message d'accueil personnalisé
    const welcomeResponse = await generateAIResponse()
    setCurrentAIResponse(welcomeResponse)

    const welcomeMessage: Message = {
      id: 1,
      speaker: "ai",
      text: welcomeResponse.text,
      timestamp: new Date().toLocaleTimeString(),
    }

    setMessages([welcomeMessage])
    setAvatarEmotion(welcomeResponse.emotion)
    speakText(welcomeResponse.text)

    // Démarrer le timer
    const timer = setInterval(() => {
      setSimulationTime((prev) => prev + 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [initializeMedia, generateAIResponse, speakText])

  // Gestion des réponses utilisateur (simulation)
  const handleUserResponse = useCallback(async () => {
    if (!isRecording || isPaused) return

    // Simulation d'une réponse utilisateur
    const userMessage: Message = {
      id: messages.length + 1,
      speaker: "user",
      text: "Merci pour cette question. Laissez-moi vous expliquer notre approche...",
      timestamp: new Date().toLocaleTimeString(),
    }

    setMessages((prev) => [...prev, userMessage])

    // Générer une réponse IA après un délai
    setTimeout(async () => {
      const aiResponse = await generateAIResponse(userMessage.text)
      setCurrentAIResponse(aiResponse)

      const aiMessage: Message = {
        id: messages.length + 2,
        speaker: "ai",
        text: aiResponse.text,
        timestamp: new Date().toLocaleTimeString(),
      }

      setMessages((prev) => [...prev, aiMessage])
      setAvatarEmotion(aiResponse.emotion)
      speakText(aiResponse.text)
    }, 3000)
  }, [isRecording, isPaused, messages.length, generateAIResponse, speakText])

  // Contrôles de la simulation
  const togglePause = () => {
    setIsPaused(!isPaused)
    if (speechSynthesis.speaking) {
      if (isPaused) {
        speechSynthesis.resume()
      } else {
        speechSynthesis.pause()
      }
    }
  }

  const toggleVideo = async () => {
    setIsVideoEnabled(!isVideoEnabled)
    if (streamRef.current) {
      const videoTrack = streamRef.current.getVideoTracks()[0]
      if (videoTrack) {
        videoTrack.enabled = !isVideoEnabled
      }
    }
  }

  const toggleAudio = () => {
    setIsAudioEnabled(!isAudioEnabled)
    if (streamRef.current) {
      const audioTrack = streamRef.current.getAudioTracks()[0]
      if (audioTrack) {
        audioTrack.enabled = !isAudioEnabled
      }
    }
  }

  const endSimulation = () => {
    // Arrêter tous les médias
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
    }
    if (audioContextRef.current) {
      audioContextRef.current.close()
    }
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current)
    }
    if (speechSynthesis.speaking) {
      speechSynthesis.cancel()
    }

    router.push(`/feedback?client=${clientId}&type=${meetingTypeId}&duration=${simulationTime}`)
  }

  // Nettoyage à la fermeture
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop())
      }
      if (audioContextRef.current) {
        audioContextRef.current.close()
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [])

  // Simulation automatique de questions
  useEffect(() => {
    if (!isRecording || isPaused) return

    const questionInterval = setInterval(() => {
      handleUserResponse()
    }, 15000) // Nouvelle question toutes les 15 secondes

    return () => clearInterval(questionInterval)
  }, [isRecording, isPaused, handleUserResponse])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const getEmotionColor = (value: number) => {
    if (value > 70) return "text-green-600"
    if (value > 40) return "text-yellow-600"
    return "text-red-600"
  }

  const getAvatarStyle = () => {
    let transform = "scale(1)"
    let filter = "brightness(1)"

    if (avatarSpeaking) {
      transform = "scale(1.05)"
    }

    switch (avatarEmotion) {
      case "happy":
        filter = "brightness(1.1) saturate(1.2)"
        break
      case "concerned":
        filter = "brightness(0.9) saturate(0.8)"
        break
      case "excited":
        filter = "brightness(1.2) saturate(1.3)"
        break
      case "thinking":
        filter = "brightness(0.95) saturate(0.9)"
        break
    }

    return {
      transform,
      filter,
      transition: "all 0.3s ease",
    }
  }

  if (!user || !client || !meetingType) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 px-4 py-3 sticky top-0 z-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 sm:space-x-4 flex-1 min-w-0">
            <Button
              variant="ghost"
              onClick={() => router.push("/")}
              className="flex items-center space-x-2 text-white hover:bg-gray-700 flex-shrink-0"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Accueil</span>
            </Button>
            <div className="text-xl sm:text-2xl flex-shrink-0">{client.logo}</div>
            <div className="min-w-0">
              <h1 className="text-sm sm:text-xl font-semibold truncate">Simulation Live - {client.name}</h1>
              <div className="flex items-center space-x-2 flex-wrap">
                <Badge variant="outline" className="border-blue-400 text-blue-400 text-xs">
                  {meetingType.icon} {meetingType.name}
                </Badge>
                <Badge variant="secondary" className="text-xs truncate max-w-24 sm:max-w-none">
                  {user.name}
                </Badge>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2 sm:space-x-4 flex-shrink-0">
            <div className="text-sm sm:text-lg font-mono text-green-400">{formatTime(simulationTime)}</div>
            <Button variant="outline" onClick={togglePause} className="border-gray-600 bg-transparent p-2">
              {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
            </Button>
            <Button variant="destructive" onClick={endSimulation} className="text-xs sm:text-sm">
              <Square className="w-4 h-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Terminer</span>
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-4 sm:py-6">
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-4 sm:gap-6">
          {/* Zone vidéo principale */}
          <div className="xl:col-span-3 space-y-4 sm:space-y-6">
            {/* Avatar IA et Utilisateur */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {/* Avatar IA */}
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center justify-between text-white text-sm sm:text-base">
                    <span className="truncate">{client.contact}</span>
                    <div className="flex items-center space-x-2 flex-shrink-0">
                      {avatarSpeaking && (
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse delay-100"></div>
                          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse delay-200"></div>
                        </div>
                      )}
                      <Badge className="bg-blue-600 text-xs">{avatarEmotion}</Badge>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="relative">
                    <div
                      className="w-full h-48 sm:h-64 bg-gradient-to-br from-blue-600 to-purple-700 rounded-lg flex items-center justify-center overflow-hidden"
                      style={getAvatarStyle()}
                    >
                      {/* Avatar personnalisé par client */}
                      <div className="relative w-24 h-24 sm:w-32 sm:h-32">
                        <div className="text-4xl sm:text-6xl">{client.logo}</div>
                        <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2">
                          <div className="text-xs text-white bg-black/50 px-2 py-1 rounded truncate max-w-32">
                            {client.name}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Contrôles avatar */}
                    <div className="absolute bottom-4 right-4 flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="bg-gray-800/80 border-gray-600 p-2"
                        onClick={() => speechSynthesis.cancel()}
                      >
                        <VolumeX className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline" className="bg-gray-800/80 border-gray-600 p-2">
                        <Settings className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Volume avatar */}
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Volume Avatar</span>
                      <span>{avatarVolume[0]}%</span>
                    </div>
                    <Slider
                      value={avatarVolume}
                      onValueChange={setAvatarVolume}
                      max={100}
                      step={1}
                      className="w-full"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Vidéo utilisateur */}
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center justify-between text-white text-sm sm:text-base">
                    <span className="truncate">Vous - {user.name}</span>
                    <div className="flex items-center space-x-2 flex-shrink-0">
                      <div
                        className={`w-3 h-3 rounded-full ${isRecording && !isPaused ? "bg-red-500 animate-pulse" : "bg-gray-500"}`}
                      ></div>
                      <Badge variant={isRecording ? "default" : "secondary"} className="text-xs">
                        {isRecording ? "Live" : "Arrêté"}
                      </Badge>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="relative">
                    {isVideoEnabled ? (
                      <video
                        ref={videoRef}
                        autoPlay
                        muted
                        playsInline
                        className="w-full h-48 sm:h-64 bg-gray-900 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="w-full h-48 sm:h-64 bg-gray-900 rounded-lg flex items-center justify-center">
                        <CameraOff className="w-12 h-12 sm:w-16 sm:h-16 text-gray-500" />
                      </div>
                    )}

                    {/* Contrôles utilisateur */}
                    <div className="absolute bottom-4 left-4 flex space-x-2">
                      <Button
                        size="sm"
                        variant={isVideoEnabled ? "default" : "outline"}
                        onClick={toggleVideo}
                        className="bg-gray-800/80 p-2"
                      >
                        {isVideoEnabled ? <Camera className="w-4 h-4" /> : <CameraOff className="w-4 h-4" />}
                      </Button>
                      <Button
                        size="sm"
                        variant={isAudioEnabled ? "default" : "outline"}
                        onClick={toggleAudio}
                        className="bg-gray-800/80 p-2"
                      >
                        {isAudioEnabled ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
                      </Button>
                    </div>

                    <div className="absolute bottom-4 right-4">
                      <Button size="sm" variant="outline" className="bg-gray-800/80 border-gray-600 p-2">
                        <Maximize className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Transcription en temps réel */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white text-sm sm:text-base">Transcription Live</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-32 sm:h-48 overflow-y-auto space-y-3 bg-gray-900 p-4 rounded-lg">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.speaker === "ai" ? "justify-start" : "justify-end"}`}
                    >
                      <div
                        className={`max-w-xs px-3 py-2 rounded-lg ${
                          message.speaker === "ai" ? "bg-blue-600 text-white" : "bg-green-600 text-white"
                        }`}
                      >
                        <div className="text-xs opacity-70 mb-1 truncate">
                          {message.speaker === "ai" ? client.contact.split(" - ")[0] : user.name.split(" ")[0]} -{" "}
                          {message.timestamp}
                        </div>
                        <div className="text-xs sm:text-sm">{message.text}</div>
                      </div>
                    </div>
                  ))}
                  {avatarSpeaking && (
                    <div className="flex justify-start">
                      <div className="bg-blue-600 text-white px-3 py-2 rounded-lg">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-white rounded-full animate-bounce delay-100"></div>
                          <div className="w-2 h-2 bg-white rounded-full animate-bounce delay-200"></div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Panneau de contrôle */}
          <div className="space-y-4 sm:space-y-6">
            {/* Contrôles principaux */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white text-sm sm:text-base">Contrôles</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {!isRecording ? (
                  <Button
                    onClick={startSimulation}
                    className="w-full bg-green-600 hover:bg-green-700 text-sm"
                    size="lg"
                  >
                    <Play className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                    Démarrer Live
                  </Button>
                ) : (
                  <div className="space-y-2">
                    <Button
                      onClick={togglePause}
                      variant="outline"
                      className="w-full border-gray-600 bg-transparent text-sm"
                    >
                      {isPaused ? <Play className="w-4 h-4 mr-2" /> : <Pause className="w-4 h-4 mr-2" />}
                      {isPaused ? "Reprendre" : "Pause"}
                    </Button>
                    <Button
                      onClick={() => handleUserResponse()}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-sm"
                    >
                      <Brain className="w-4 h-4 mr-2" />
                      Nouvelle Question
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Indicateur de volume */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-white text-sm sm:text-base">
                  <Volume2 className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>Audio Live</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Progress value={volumeLevel} className="w-full" />
                  <p className="text-xs sm:text-sm text-gray-300">Niveau: {Math.round(volumeLevel)}%</p>
                  <div className="flex items-center space-x-2 text-xs">
                    <div className={`w-2 h-2 rounded-full ${volumeLevel > 10 ? "bg-green-400" : "bg-gray-500"}`}></div>
                    <span className="text-gray-400">Micro actif</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Émotions en temps réel */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-white text-sm sm:text-base">
                  <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-red-400" />
                  <span>Analyse Live</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(emotions).map(([key, value]) => (
                  <div key={key}>
                    <div className="flex justify-between text-xs sm:text-sm mb-1">
                      <span className="capitalize text-gray-300">{key}</span>
                      <span className={getEmotionColor(value)}>{Math.round(value)}%</span>
                    </div>
                    <Progress value={value} className="w-full h-2" />
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Conseils temps réel */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-white text-sm sm:text-base">
                  <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400" />
                  <span>Coach Live</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-yellow-900/30 p-3 rounded-lg border border-yellow-600/30">
                  <p className="text-xs sm:text-sm text-yellow-200">
                    💡{" "}
                    {emotions.stress > 60
                      ? "Respirez profondément. Prenez votre temps pour répondre."
                      : emotions.confidence < 50
                        ? "Maintenez le contact visuel. Votre expertise est précieuse."
                        : "Excellente posture ! Continuez à écouter activement."}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
