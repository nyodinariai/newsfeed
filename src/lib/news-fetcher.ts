

const fetchInterval = 80 * 60 * 1000
let isFetching = false;

export const startNewsUpdater = () => {
    if(isFetching) return;
    isFetching = true;


    setInterval(async () => {
        const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL
        const category = ['technology', 'business', 'science']


        try {
          console.log('Fetching news...');

          let i = 0
          while (i < category.length){
            const response = await fetch(`${NEXT_PUBLIC_API_URL}/api/update-news?category=${category[i]}`);
            const result = await response.json();
            console.log('News update result:', result);
          }


        } catch (error) {
          console.error('Error fetching news:', error);
        }
      }, fetchInterval);
}