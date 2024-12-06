

const fetchInterval = 80 * 60 * 1000
let isFetching = false;

export const startNewsUpdater = () => {
    if(isFetching) return;
    isFetching = true;


    setInterval(async () => {
        try {
          console.log('Fetching news...');
          const response = await fetch('http://localhost:3000/api/update-news');
          const result = await response.json();
          console.log('News update result:', result);
        } catch (error) {
          console.error('Error fetching news:', error);
        }
      }, fetchInterval);
}