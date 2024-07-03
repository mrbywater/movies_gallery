import './ListCard.scss';
import { faStar as fullStar } from '@fortawesome/free-solid-svg-icons';
import { faStar as emptyStar } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

type ListCardProps = {
  img: string;
  name: string;
  year: number;
  description: string;
  genres: string[];
  favoritesHandler: (event: any) => void;
  favorite: boolean;
  goToMovieProfile: () => void;
};
const ListCard = (props: ListCardProps) => {
  const {
    img,
    name,
    year,
    description,
    genres,
    favoritesHandler,
    favorite,
    goToMovieProfile,
  } = props;

  return (
    <div className="listCardMainContainer">
      <FontAwesomeIcon
        icon={!favorite ? emptyStar : fullStar}
        onClick={favoritesHandler}
      />
      <div className="imageContainer">
        <img src={img} alt={name} onClick={goToMovieProfile} />
      </div>
      <div className="descriptionContainer">
        <div>
          <span onClick={goToMovieProfile}>
            <b>{name}</b>
          </span>
          <span>{year}</span>
          <span title={description}>{description}</span>
        </div>
        <div>
          {genres.map(genre => (
            <div key={genre}>
              {genre.charAt(0).toUpperCase() + genre.slice(1)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ListCard;
