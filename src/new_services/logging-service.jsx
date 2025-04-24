const LoggingService = (() => {
  const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  const FRONTEND_LOGS = process.env.VITE_REACT_APP_FRONTEND_LOGS || 'https://api.example.com/logs';

  const sendLog = async (message, level, candidateData = null) => {
    const formattedMessage = `[${level}] ${message}`;

    if (isLocalhost) {
      // Use native console methods for localhost to ensure correct display
      const consoleMethod = {
        INFO: console.info,
        WARN: console.warn,
        ERROR: console.error,
        DEBUG: console.debug,
        CRITICAL: console.error
      }[level] || console.log;
      consoleMethod(formattedMessage);
      return;
    }

    // Production: send to backend
    try {
      const interview = candidateData?.Interviews?.[0];
      const candidateDetails = interview
        ? ` - Candidate ID: ${interview.candidate_id} - Interview ID: ${interview.id}`
        : ' - No candidate data';

      const payload = {
        level,
        message: `${message}${candidateDetails}`,
        timestamp: new Date().toISOString(),
        interviewId: interview?.id || 'unknown'
      };

      const response = await fetch(FRONTEND_LOGS, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }
    } catch (error) {
      // Silent error handling to prevent app crashes
      // Avoid logging errors to console in production to prevent recursion
    }
  };

  // Override console methods only in production
  if (!isLocalhost) {
    const originalConsole = {
      log: console.log,
      info: console.info,
      warn: console.warn,
      error: console.error,
      debug: console.debug
    };

    const logLevels = {
      log: 'INFO',
      info: 'INFO',
      warn: 'WARN',
      error: 'ERROR',
      debug: 'DEBUG'
    };

    Object.keys(logLevels).forEach(method => {
      console[method] = (...args) => {
        const message = args
          .map(arg => (typeof arg === 'object' ? JSON.stringify(arg) : String(arg)))
          .join(' ');
        sendLog(message, logLevels[method]);
      };
    });

    console.critical = (message, data) => {
      const formattedMessage = data ? `${message} ${JSON.stringify(data)}` : message;
      sendLog(formattedMessage, 'CRITICAL');
    };
  }

  return {
    log: (message, candidateData) => sendLog(message, 'INFO', candidateData),
    info: (message, candidateData) => sendLog(message, 'INFO', candidateData),
    warn: (message, candidateData) => sendLog(message, 'WARN', candidateData),
    error: (message, candidateData) => sendLog(message, 'ERROR', candidateData),
    debug: (message, candidateData) => sendLog(message, 'DEBUG', candidateData),
    critical: (message, candidateData) => sendLog(message, 'CRITICAL', candidateData)
  };
})();

export default LoggingService;