export const BottomNavbar = () => {
  const arr = new Array(20).fill(1);
  return (
    <>
      {arr.map((a, i) => (
        <p key={i} className="w-full h-full bg-gray-100 dark:bg-stone-700"></p>
      ))}
    </>
  );
};
