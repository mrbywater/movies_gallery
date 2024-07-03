import './SquareCard.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar as fullStar } from '@fortawesome/free-solid-svg-icons';
import { faStar as emptyStar } from '@fortawesome/free-regular-svg-icons';

type SquareCardProps = {
  img: string;
  name: string;
  year: number;
  favoritesHandler: (event: any) => void;
  goToMovieProfile: () => void;
  favorite: boolean;
};

const SquareCard = (props: SquareCardProps) => {
  const { img, name, year, favoritesHandler, goToMovieProfile, favorite } =
    props;

  return (
    <div className="squareCardMainContainer" onClick={goToMovieProfile}>
      <img src={img} alt={name} />
      <span>
        <b>{name}</b>
      </span>
      <span>{year}</span>
      <FontAwesomeIcon
        icon={!favorite ? emptyStar : fullStar}
        onClick={favoritesHandler}
      />
    </div>
  );
};

export default SquareCard;
