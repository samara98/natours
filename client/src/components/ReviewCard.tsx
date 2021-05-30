import React from 'react';

type Props = {
  review: any;
};

const ReviewCard: React.FC<Props> = (props) => {
  return (
    <div className="reviews__card">
      <div className="reviews__avatar">
        <img
          src={`/img/users/${props.review.user.photo}`}
          alt={`${props.review.user.name}`}
          className="reviews__avatar-img"
        />
        <h6 className="reviews__user">{props.review.user.name}</h6>
      </div>
      <p className="reviews__text">{props.review.review}</p>
      <div className="reviews__rating">
        {[1, 2, 3, 4, 5].map((star, idx) => (
          <svg
            className={`reviews__star reviews__star--${
              props.review.rating >= star ? 'active' : 'inactive'
            }`}
            key={idx}
          >
            <use xlinkHref="/img/icons.svg#icon-star" />
          </svg>
        ))}
      </div>
    </div>
  );
};

export default ReviewCard;
