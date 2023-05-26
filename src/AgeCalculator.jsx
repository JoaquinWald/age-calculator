import { useEffect, useRef, useState } from "react";
import 'animate.css';
import anime from "animejs/lib/anime.es.js";

export const AgeCalculator = () => {

  const birtday = {
    birtdayDay: '',
    birtdayMonth: '',
    birtdayYear: '',
  }

  const [formState, setFormState] = useState(birtday);
  const [age, setAge] = useState({});

  const [dayError, setDayError] = useState(false);
  const [monthError, setMonthError] = useState(false);
  const [yearError, setYearError] = useState(false);

  const [emptyFieldError, setEmptyFieldError] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);



  const onInputChange = ({ target }) => {
    const { name, value } = target;
    setFormState((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    if (name === 'birtdayDay') {
      const dayValue = parseInt(value, 10);
      const monthValue = parseInt(formState.birtdayMonth, 10);
      const maxDay = getMaxDayOfMonth(monthValue);

      if (dayValue < 1 || dayValue > maxDay) {
        setDayError(true);
      } else {
        setDayError(false);
      }
    }

    if (name === 'birtdayMonth') {
      const monthValue = parseInt(value, 10);
      const dayValue = parseInt(formState.birtdayDay, 10);
      const maxDay = getMaxDayOfMonth(monthValue);

      if (monthValue < 1 || monthValue > 12) {
        setMonthError(true);
      } else {
        setMonthError(false);

        if (dayValue < 1 || dayValue > maxDay) {
          setDayError(true);
        } else {
          setDayError(false);
        }
      }
    }

    if (name === 'birtdayYear') {
      const yearValue = parseInt(value, 10);
      const today = new Date();
      const currentYear = today.getFullYear();

      if (yearValue > currentYear) {
        setYearError(true);
      } else {
        setYearError(false);
      }
    }
  };

  const getMaxDayOfMonth = (month) => {
    const thirtyOneDaysMonths = [1, 3, 5, 7, 8, 10, 12];
    const thirtyDaysMonths = [4, 6, 9, 11];

    if (thirtyOneDaysMonths.includes(month)) {
      return 31;
    } else if (thirtyDaysMonths.includes(month)) {
      return 30;
    } else {
      return 28; // Assuming February always has 28 days
    }
  };


  const onSubmit = (e) => {
    e.preventDefault();

    setFormSubmitted(true);

    if (!formState.birtdayDay || !formState.birtdayMonth || !formState.birtdayYear) {
      setEmptyFieldError(true)
      return;
    }

    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth() + 1;
    const currentDay = today.getDate();

    const birthYear = parseInt(formState.birtdayYear);
    const birthMonth = parseInt(formState.birtdayMonth);
    const birthDay = parseInt(formState.birtdayDay);

    let year = currentYear - birthYear;
    let month = currentMonth - birthMonth;
    let day = currentDay - birthDay;

    if (month < 0 || (month === 0 && day < 0)) {
      year--;
      month += 12;
    }

    if (day < 0) {
      const lastMonthDate = new Date(currentYear, currentMonth - 1, 0).getDate();
      day += lastMonthDate;
      month -= 1;
    }

    if (currentMonth < birthMonth || (currentMonth === birthMonth && currentDay < birthDay)) {
      year - 1;
    }

    setAge({
      year: (year >= 0) ? year : 0,
      month: (month >= 0) ? month : 0,
      day: (day >= 0) ? day : 0,
    });

    setEmptyFieldError(false);

  }

  const yearRef = useRef(null);
  const monthRef = useRef(null);
  const dayRef = useRef(null);

  useEffect(() => {
    const yearTarget = yearRef.current;
    const monthTarget = monthRef.current;
    const dayTarget = dayRef.current;

    anime({
      targets: [yearTarget, monthTarget, dayTarget],
      opacity: [0, 1],
      translateY: [-30, 0],
      delay: anime.stagger(300),
      duration: 1000,
      easing: 'easeOutQuad',
    });
  }, [age]);



  return (
    <main className="h-[500px] bg-white m-3 mt-20 rounded-t-3xl rounded-br-[80px] rounded-bl-3xl md:max-w-2xl md:px-5 md:mx-auto">
      <form onSubmit={onSubmit}>

        <section className="min-h-[200px] pt-12 mx-3 animate__animated animate__fadeIn">
          <article className="flex justify-evenly appearance-none">

            <div>
              <p className="text-gray-500 text-[12px] tracking-widest mb-1 ml-1">DAY</p>
              <input
                className="w-20 h-12 border rounded-lg p-3 appearance-none"
                type="text"
                maxLength={2}
                placeholder="DD"
                name="birtdayDay"
                value={formState.birtdayDay}
                onChange={onInputChange}
                style={{ borderColor: !formState.birtdayDay && formSubmitted ? 'red' : '' }}
              />
              {dayError && <p className="mt-2 ml-1 w-20 text-red-500 text-xs font-sans">El día debe ser correcto. </p>}
            </div>
            <div>
              <p className="text-gray-500 text-[12px] tracking-widest mb-1 ml-1">MONTH</p>
              <input
                className="w-20 h-12 border rounded-lg p-3 appearance-none" placeholder="MM"
                type="text"
                maxLength={2}
                name="birtdayMonth"
                value={formState.birtdayMonth}
                onChange={onInputChange}
                style={{ borderColor: !formState.birtdayMonth && formSubmitted ? 'red' : '' }}
              />
              {monthError && <p className="mt-2 ml-1 w-20 text-red-500 text-xs font-sans">El mes debe estar entre 1 y 12. </p>}
            </div>
            <div>
              <p className="text-gray-500 text-[12px] tracking-widest mb-1 ml-1">YEAR</p>
              <input
                className="w-20 h-12 border rounded-lg p-3 appearance-none" placeholder="YYYY"
                type="text"
                maxLength={4}
                name="birtdayYear"
                value={formState.birtdayYear}
                onChange={onInputChange}
                style={{ borderColor: !formState.birtdayYear && formSubmitted ? 'red' : '' }}
              />
              {yearError && <p className="mt-2 ml-1 w-20 text-red-500 text-xs font-sans">El año debe ser menor al actual. </p>}
            </div>

          </article>
          {emptyFieldError && (
            <div className="text-center">

              <p className="mt-2 ml-1 text-red-500 text-xs font-sans">
                Por favor, completa todos los campos.
              </p>

            </div>
          )}
        </section>


        <br />
        <br />


        <section className="">
          <article className="flex justify-center">
            <hr className="w-5/6" />
          </article>
          <article className="flex justify-center sm:justify-end sm:mr-8 animate__animated animate__pulse">
            <button
              type="submit"
              className="relative bottom-8">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/9d/Arrow-down.svg/800px-Arrow-down.svg.png"
                alt="arrow image"
                className="bg-purple-600 w-16 h-16 rounded-full p-3 object-contain" />
            </button>
          </article>
        </section>

      </form>


      <section className="flex justify-center animate__animated animate__pulse">
        <article className="">

          <div className="flex items-center">
            <p ref={yearRef} className="mr-2 text-purple-600 text-5xl">{(age.year && !yearError && !monthError && !dayError) ? age.year : '--'}</p>
            <h2 className="text-5xl italic font-extrabold">years</h2>
          </div>
          <div className="flex items-center">
            <p ref={monthRef} className="mr-2 text-purple-600 text-5xl">{(age.month && !monthError && !yearError && !dayError) ? age.month : '--'}</p>
            <h2 className="text-5xl italic font-extrabold">months</h2>
          </div>
          <div className="flex items-center">
            <p ref={dayRef} className="mr-2 text-purple-600 text-5xl">{(age.day && !dayError && !yearError && !monthError) ? age.day : '--'}</p>
            <h2 className="text-5xl italic font-extrabold">days</h2>
          </div>

        </article>
      </section>

    </main>
  )
}
