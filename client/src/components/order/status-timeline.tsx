interface StatusTimelineProps {
  statuses: Array<{
    status: string;
    message: string;
    timestamp: string;
    completed: boolean;
  }>;
}

export function StatusTimeline({ statuses }: StatusTimelineProps) {
  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString('en-IN', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="status-timeline" data-testid="status-timeline">
      {statuses.map((status, index) => (
        <div 
          key={index} 
          className={`status-item ${status.completed ? 'completed' : ''}`}
          data-testid={`status-item-${index}`}
        >
          <div className="pl-2">
            <p className={`font-medium ${status.completed ? 'text-gray-800' : 'text-gray-600'}`}>
              {status.status}
            </p>
            <p className={`text-sm ${status.completed ? 'text-gray-500' : 'text-gray-400'}`}>
              {status.completed ? formatTimestamp(status.timestamp) : status.message}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
