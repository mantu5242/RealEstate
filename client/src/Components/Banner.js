import React,{useEffect, useState} from 'react'

const Banner = ({images, interval=3000}) => {

    const [Index, setIndex] = useState(0);
    
    
    const prevSlide = ()=> {
        setIndex((prevIndex) => 
            prevIndex === 0 ? images.length -1: prevIndex - 1
            // console.log(prevIndex)
        )
    }

    const nextSlide = () => {
        setIndex(prevIndex =>
            prevIndex === images.length - 1 ? 0 : prevIndex + 1
            // console.log(prevIndex)
        )
    }

    const goToSlide = (index) => {
        setActiveIndex(index);
      };



      const handleIndicatorClick = (i) => {
        setIndex(i);
    };
    const bannerIndicator = ({images, Index, onClick}) => {
        return (
            <div className="carousel__indicators">
      {images.map((_, index) => (
        <span
          key={index}
          className={`carousel__indicator ${
            index === Index ? 'active' : ''
          }`}
          onClick={() => onClick(index)}
        />
      ))}
    </div>
        )
    }

    useEffect(()=>{
        const autoPlayInterval  = setInterval(nextSlide,interval);
        return () => {
            clearInterval(autoPlayInterval);
        }
    },[interval])

  return (
    <div className='relative'>
      <div className='absolute top-1/2 transform -translate-y-1/2 z-10 left-0 w-8 h-8 ml-5 bg-gray-800 rounded-full flex justify-center items-center cursor-pointer' onClick={prevSlide}>  </div>
      <div className='relative h-96 w-full'>
        <img className=' h-full w-full' src={images[Index]} alt={`slide-${Index}`}/>
      </div>
      <div className='absolute top-1/2 transform -translate-y-1/2 z-10 right-0 w-8 h-8 mr-5 bg-gray-800 rounded-full flex justify-center items-center cursor-pointer' onClick={nextSlide}> </div>
      

      <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
    {images.map((_, i) => ( 
        <div
            key={i}
            className={`w-2 h-2 rounded-full ${Index === i ? 'bg-gray-200' : 'bg-gray-500'} cursor-pointer`}
            onClick={() => handleIndicatorClick(i)}
        />
    ))}
</div>

      
    </div>
  )
}

export default Banner
