import { useEffect } from "react";
import { toast } from "react-toastify";

const GlobalTimer = () => {
  useEffect(() => {
    const interval = setInterval(() => {
      const sessions = JSON.parse(localStorage.getItem("scheduledSessions")) || [];
      const timers = JSON.parse(localStorage.getItem("sessionTimers")) || {};
      const activeSession = JSON.parse(localStorage.getItem("activeSession")) || null;

      const now = Date.now();
      let activeStillExists = false;

      const updatedSessions = sessions.map((session) => {
        const topic = session.topic;
        const timerData = timers[topic] || { elapsedTime: 0, isRunning: false, lastUpdate: 0 };

        if (!timerData.isRunning || activeSession?.topic !== topic) return session;

        let elapsedTime = timerData.elapsedTime + Math.floor((now - timerData.lastUpdate) / 1000);
        const durationInSeconds = session.duration && session.duration !== "N/A"
          ? parseFloat(session.duration) * 3600
          : Infinity;

        if (elapsedTime >= durationInSeconds) {
          toast.info(`Session "${topic}" has ended!`, {
            position: "top-right",
            autoClose: 3000,
          });

          const playSound = () => {
            const audio = new Audio('/notification.mp3');
            audio.play().catch((e) => console.log("Audio playback failed:", e));
          };
          playSound();

          const sendSMS = async (message) => {
            try {
              const response = await fetch("http://localhost:5000/send-sms", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message, toPhoneNumber: "+919381890586" }),
              });
              if (!response.ok) throw new Error("Failed to send SMS");
              console.log("SMS sent:", await response.json());
            } catch (error) {
              console.error("Error sending SMS:", error);
            }
          };
          sendSMS(`Session '${topic}' ended!`);

          const completedSessions = JSON.parse(localStorage.getItem("completedSessions")) || [];
          if (!completedSessions.some((s) => s.id === session.id)) {
            completedSessions.push({ ...session, completed: true, completedTime: elapsedTime });
            localStorage.setItem("completedSessions", JSON.stringify(completedSessions));
          }
          return null; // Remove from scheduled sessions
        } else {
          timers[topic] = {
            elapsedTime,
            isRunning: true,
            lastUpdate: now,
          };
          activeStillExists = true;
          return { ...session, timer: elapsedTime, isTimerRunning: true, active: true };
        }
      }).filter((session) => session !== null);

      localStorage.setItem("scheduledSessions", JSON.stringify(updatedSessions));
      localStorage.setItem("sessionTimers", JSON.stringify(timers));
      if (!activeStillExists) {
        localStorage.removeItem("activeSession");
      } else {
        const active = updatedSessions.find((s) => s.active);
        if (active) localStorage.setItem("activeSession", JSON.stringify(active));
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return null;
};

export default GlobalTimer;