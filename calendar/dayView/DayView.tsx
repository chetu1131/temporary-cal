import { useEffect, useState } from 'react';
import { Form, Formik, FormikValues } from 'formik';
import { Event } from '../types';
import { DayProgress } from '../DayProgress';
import Modal from '../EvenModal';
import InputField from '../../../components/Input/index';

import {
  eachHourOfInterval,
  endOfDay,
  formatDate,
  isToday,
  startOfDay,
} from '../DateFunctions';

export type DayViewProps = {
  date: Date;
  events?: Event[];
};

const initialValues = {
  id: '',
  date: '',
  title: '',
  start_time: new Date(),
  end_time: '',
};
export const DayView: React.FC<DayViewProps> = ({
  date, // events = []
}) => {
  const [hours, setHours] = useState<Date[]>([]);
  const isDayToday: boolean = isToday(date);
  const [ref, setRef] = useState<HTMLDivElement | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  // const [initialValues, setInitialValues] = useState<Event>({
  //   id: '',
  //   date: new Date(),
  //   title: '',
  //   start_date: new Date(),
  //   end_date: new Date(),
  // });
  const handleClose = () => {
    setIsModalOpen(false);
  };

  const handleOpen = () => {
    setIsModalOpen(true);
  };

  const onSubmit = async (values: FormikValues) => {
    try {
      console.log(values);
      setTimeout(() => {
        handleClose();
      }, 300);
    } catch (error) {
      console.error('Error creating actor:', error);
    }
  };
  useEffect(() => {
    setHours(
      eachHourOfInterval({
        start: startOfDay(date),
        end: endOfDay(date),
      })
    );
  }, [date, hours]);

  return (
    <>
      <section className="flex-1 h-full">
        <div className="flex-1 max-h-full" onClick={handleOpen}>
          <div className="relative" ref={(ref) => setRef(ref)}>
            {hours.map((time, index) => (
              <div className="h-14 flex" key={time.toISOString() + index}>
                <div className="h-full w-24 flex items-start justify-center">
                  <time
                    className="text-xs -m-3 select-none"
                    dateTime={formatDate(time, 'yyyy-MM-dd')}
                  >
                    {index === 0 ? '' : formatDate(time, 'h a')}
                  </time>
                </div>
                <div className="flex-1 relative border-b border-l left-" />
              </div>
            ))}

            {isDayToday && (
              <DayProgress
                containerHeight={ref?.offsetHeight || 1}
                classNames="left-[88px]"
              />
            )}
          </div>
        </div>
      </section>

      <Modal isOpen={isModalOpen} onClose={handleClose}>
        <div className="container mx-auto w-4/5 flex justify-center  ">
          <Formik
            enableReinitialize
            initialValues={initialValues}
            // validationSchema
            onSubmit={(values) => onSubmit(values)}
          >
            {({ values }) => (
              <Form>
                <InputField
                  name="Title"
                  type="text"
                  lable="Title"
                  value={values.title}
                  isCompulsory={true}
                  showError={true}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5     w-72 outline-none"
                />

                <time dateTime={formatDate(values.start_time, 'h m')}>
                  {formatDate(values.start_time, 'h m a')}
                </time>
                <InputField
                  name="Date"
                  type="date"
                  lable="Date"
                  value={values.date}
                  isCompulsory={true}
                  showError={true}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5     w-72 outline-none"
                />

                <InputField
                  name="StartTime"
                  type="date"
                  lable="Start Time"
                  value={values.title}
                  isCompulsory={true}
                  showError={true}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5     w-72 outline-none"
                />
                <InputField
                  name="EndTime"
                  type="date"
                  lable="End "
                  value={values.end_time}
                  isCompulsory={true}
                  showError={true}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5     w-72 outline-none"
                />
                <div className="flex justify-center m-4">
                  <button
                    type="submit"
                    className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2  "
                  >
                    Save
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </Modal>
    </>
  );
};
