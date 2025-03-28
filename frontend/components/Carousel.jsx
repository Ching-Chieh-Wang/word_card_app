import PreviousIcon from './icons/PreviousIcon';
import NextIcon from './icons/NextIcon';
import Background from './Background';
import { useSwipeable } from 'react-swipeable';
import { useState } from 'react';

const Carousel = ({ slides, index, onNext, onPrev ,onClick}) => {
  const [isTapAllowed, setIsTapAllowed] = useState(true);
  
  const TAP_DELAY = 300; // Set a delay (in milliseconds) before allowing another tap
    // Use the useSwipeable hook to handle swipes
    const handlers = useSwipeable({
      onSwipedLeft: () => {
        onNext();
      },
      onSwipedRight: () => {
        onPrev();
      },
      onTap:()=>{
        if(isTapAllowed){
          onClick();
        }
        setIsTapAllowed(false);
        setTimeout(() => setIsTapAllowed(true), TAP_DELAY); // Reset tap permission after delay
      },
      trackMouse:true,
      preventDefaultTouchmoveEvent:true
    });
  return (
    
    <div className="rounded-3xl relative w-full h-full overflow-hidden">
      {/* Sliding Container for Background and Slides */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
        <div
          className="absolute flex w-[calc(100%*${slides.length})] h-full transition-transform duration-500"
          style={{
            transform: `translateX(-${index * (100 / slides.length)}%)`,
          }}
          
        >
          <Background />
        </div>
      </div>

      {/* Slides Container */}
      <div
        className="relative flex w-full h-full transition-transform duration-500"
        {...handlers}
        style={{
          transform: `translateX(-${index * 100}%)`,
        }}
      >
        {slides.map((slide, i) => (
          <div
            key={`slide-${i}`}
            className="flex-shrink-0 w-full h-full relative"

          >
            {/* Slide Content */}
            <div className="absolute inset-0 flex items-center justify-center">
              {slide}
            </div>
          </div>
        ))}
      </div>

      {/* Navigation */}
      {index > 0 && (
        <button
          onClick={onPrev}
          className="absolute z-50 top-1/2 left-2 transform -translate-y-1/2 bg-gray-300 px-2 py-1 rounded opacity-50"
        >
          <PreviousIcon />
        </button>
      )}
      {index < slides.length - 1 && (
        <button
          onClick={onNext}
          className="absolute z-50 top-1/2 right-2 transform -translate-y-1/2 bg-gray-300 px-2 py-1 rounded opacity-50"
        >
          <NextIcon />
        </button>
      )}
    </div>
  );
};

export default Carousel;