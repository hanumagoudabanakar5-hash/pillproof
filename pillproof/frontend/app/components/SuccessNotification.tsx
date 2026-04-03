interface SuccessNotificationProps {
  message: string;
  onDismiss?: () => void;
}

export default function SuccessNotification({ message, onDismiss }: SuccessNotificationProps) {
  return (
    <div className="flex items-start gap-3 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg text-sm text-green-700 dark:text-green-300">
      <span className="text-lg leading-none">✅</span>
      <p className="flex-1">{message}</p>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="shrink-0 text-green-400 hover:text-green-600 dark:text-green-500 dark:hover:text-green-300"
          aria-label="Dismiss"
        >
          ✕
        </button>
      )}
    </div>
  );
}
