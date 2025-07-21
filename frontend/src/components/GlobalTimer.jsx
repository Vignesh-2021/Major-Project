import { useEffect } from "react";
import { toast } from "react-toastify";
import { useGetUserQuery } from "../redux/features/auth/authApi";

const GlobalTimer = () => {
  // Fetch user data from the database
  const { data: userData, error: fetchError } = useGetUserQuery();
  const userPhoneNumber = userData?.user?.mobileNumber || "N/A"; // Fallback number if fetch fails

  // Current date and time (May 15, 2025, 10:59 PM IST)
  const currentDateTime = new Date("2025-05-15T22:59:00+05:30");

  useEffect(() => {
    if (fetchError) {
      console.error("Error fetching user data:", fetchError);
      toast.error("Failed to load user data for SMS notifications.");
    }

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

          const sendSMS = async (message, sessionDate) => {
            // Parse the session date and time
            const sessionDateTime = sessionDate && !isNaN(new Date(sessionDate)) ? new Date(sessionDate) : null;

            // Compare the session date-time with the current date-time
            // Allow SMS only if the session is scheduled for the current date and time (within a 1-minute window)
            if (sessionDateTime) {
              const timeDiff = Math.abs(sessionDateTime.getTime() - currentDateTime.getTime());
              const minutesDiff = timeDiff / (1000 * 60);
              if (minutesDiff > 1) {
                console.log(
                  `SMS not sent for message "${message}". Session time (${sessionDateTime.toISOString()}) does not match current time (${currentDateTime.toISOString()}).`
                );
                return;
              }
            }

            try {
              const response = await fetch("http://localhost:5000/send-sms", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message, toPhoneNumber: userPhoneNumber }),
              });
              if (!response.ok) throw new Error("Failed to send SMS");
              console.log("SMS sent:", await response.json());
              toast.success("SMS notification sent!");
            } catch (error) {
              console.error("Error sending SMS:", error);
              toast.error("Failed to send SMS notification.");
            }
          };
          sendSMS(`Session '${topic}' ended!`, session.date);

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
  }, [userPhoneNumber]); // Re-run effect if userPhoneNumber changes

  return null;
};

export default GlobalTimer;