export default function Greeting(): JSX.Element {
  const getTimeBasedGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <div className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200">
      {getTimeBasedGreeting()}
    </div>
  );
};