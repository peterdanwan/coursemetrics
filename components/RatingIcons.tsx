import { MdCircle, MdOutlineCircle } from 'react-icons/md';
import { IconType } from 'react-icons';
import { Icon } from '@chakra-ui/react';

interface RatingIconsProps {
  rating: string;
  iconSize?: number; // optional
  color?: string; // optional
}

const RatingIcons = ({ rating, iconSize = 4, color = 'teal.400' }: RatingIconsProps) => {
  const getRatingIconsArr = (rating: string) => {
    const ratingNum = parseInt(rating);
    const outlineCircleNum = 5 - ratingNum;
    const icons: IconType[] = [];

    for (let i = 0; i < ratingNum; i++) {
      icons.push(MdCircle);
    }

    if (outlineCircleNum > 0) {
      for (let i = 0; i < outlineCircleNum; i++) {
        icons.push(MdOutlineCircle);
      }
    }
    return icons;
  };

  const iconsArr = getRatingIconsArr(rating);
  return (
    <>
      {iconsArr.map((icon, index) => (
        <Icon key={index} as={icon} boxSize={iconSize} color={color} />
      ))}
    </>
  );
};

export default RatingIcons;
