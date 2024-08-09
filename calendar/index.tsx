import { Calendar } from './Calendar';
// import { eventsMock } from './eventsDummy';

const Cal = () => {
  return (
    <div>
      <Calendar date={new Date()} events={[]} />
    </div>
  );
};

export default Cal;
