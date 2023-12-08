import { useEffect, useState } from 'react';

function useAuthorized() {
  const [isOnline, setIsOnline] = useState<boolean>(true);

  useEffect(() => {
    const hasToken = window.localStorage.getItem('token');
    if (hasToken?.trim() !== '' && hasToken) {
      setIsOnline(true);
    } else {
      localStorage.clear();
      setIsOnline(false);
    }
  });

  return isOnline;
}
export default useAuthorized;
