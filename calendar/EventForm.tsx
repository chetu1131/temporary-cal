import { useState } from 'react';
import { Event } from './types';

type EventFormProps = {
  event: Event;
  onSave: (event: Event) => void;
  onCancel: () => void;
};

export const EventForm: React.FC<EventFormProps> = ({ event, onSave, onCancel }) => {
  const [title, setTitle] = useState(event?.title || '');

  const [startDate, setStartDate] = useState(
    event ? event.start_date.toISOString().slice(0, 16) : ''
  );
  const [endDate, setEndDate] = useState(
    event ? event.end_date.toISOString().slice(0, 16) : ''
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...event,
      title,
      start_date: new Date(startDate),
      end_date: new Date(endDate),
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Title</label>
        <input value={title} onChange={(e) => setTitle(e.target.value)} required />
      </div>
      <div>
        <label>Start Date</label>
        <input
          type="datetime-local"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          required
        />
      </div>
      <div>
        <label>End Date</label>
        <input
          type="datetime-local"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          required
        />
      </div>
      <div className="flex justify-end">
        <button type="button" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit">Save</button>
      </div>
    </form>
  );
};
