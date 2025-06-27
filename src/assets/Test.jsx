// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
import films from './Filmlist'

// Import Swiper styles
// import 'swiper/css';

// export const Slider=({slides}) =>{
//   return (
//     <Swiper
//       spaceBetween={50}
//       slidesPerView={5}
//       onSlideChange={() => console.log('slide change')}
//       onSwiper={(swiper) => console.log(swiper)}
//     >
//         {slides.map((slide)=> (
//             <SwiperSlide key={slide.image}>
//                 <img src={slide.image} alt={slide.title} />
//             </SwiperSlide>
//         ))}
      
//       <SwiperSlide>Slide 2</SwiperSlide>
//       <SwiperSlide>Slide 3</SwiperSlide>
//       <SwiperSlide>Slide 4</SwiperSlide>
//        <SwiperSlide>Slide 1</SwiperSlide>
//       <SwiperSlide>Slide 2</SwiperSlide>
//       <SwiperSlide>Slide 3</SwiperSlide>
//       <SwiperSlide>Slide 4</SwiperSlide>
//        <SwiperSlide>Slide 1</SwiperSlide>
//       <SwiperSlide>Slide 2</SwiperSlide>
//       <SwiperSlide>Slide 3</SwiperSlide>
//       <SwiperSlide>Slide 4</SwiperSlide>
//       ...
//     </Swiper>
//   )
// }