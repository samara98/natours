import axios, { AxiosError } from 'axios';
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import mapboxgl from 'mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax

import 'mapbox-gl/dist/mapbox-gl.css';
import serverApi from '~/api/server-api';
import { TourInterface } from '~/api/types';
import Loading from '~/components/Loading';
import OverviewBox from '~/components/OverviewBox';
import ReviewCard from '~/components/ReviewCard';
import { RootState } from '~/store/store';
import ErrorPage from '../_Error';

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN || '';

const mapStateToProps = (state: RootState) => ({
  rsAuth: state.auth,
});

const mapDispatchToProps = {};

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = RouteComponentProps<{ slug: string }> & PropsFromRedux;

const TourSlug: React.FC<Props> = (props) => {
  const [tour, setTour] = useState<TourInterface | null>(null);
  const [loading, setLoading] = useState(true);
  const [tourError, setTourError] = useState<any>(null);
  // mapbox
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map>();

  useLayoutEffect(
    () => {
      setLoading(() => true);
      (async () => {
        try {
          const tourResponse = await serverApi.get<{
            data: { tour: TourInterface };
            meta: { status: number };
          }>(`/api/v1/tours/slug/${props.match.params.slug}`);
          setTour(() => tourResponse.data.data.tour);
          setLoading(() => false);
        } catch (err) {
          if (axios.isAxiosError(err)) {
            setTourError(() => (err as AxiosError).message);
          }
          setLoading(() => false);
        }
      })();
      return () => {
        setTourError(null);
      };
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  useEffect(() => {
    console.log('map');
    if (map.current || loading || !tour || !mapContainer.current) return () => {}; // initialize map only once
    try {
      console.log('map-box');
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/light-v10',
        scrollZoom: false,
      });

      const bounds = new mapboxgl.LngLatBounds();

      tour.locations.forEach((loc) => {
        // Create marker
        const el = document.createElement('div');
        el.className = 'marker';

        // Add marker
        new mapboxgl.Marker({
          element: el,
          anchor: 'bottom',
        })
          .setLngLat(loc.coordinates)
          .addTo(map.current!);

        // Add popup
        new mapboxgl.Popup({
          offset: 30,
        })
          .setLngLat(loc.coordinates)
          .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
          .addTo(map.current!);

        // Extend map bounds to include current location
        bounds.extend(loc.coordinates);
      });

      map.current.fitBounds(bounds, {
        padding: {
          top: 200,
          bottom: 150,
          left: 100,
          right: 100,
        },
      });
    } catch (err) {
      console.error(err);
    }

    return () => {
      map.current?.remove();
    };
  });

  if (loading) {
    return <Loading />;
  }

  if (tourError || !tour) {
    return <ErrorPage msg={tourError} />;
  }

  return (
    <>
      <section className="section-header">
        <div className="header__hero">
          <div className="header__hero-overlay">&nbsp;</div>
          <img
            src={`/img/tours/${tour.imageCover}`}
            alt={`${tour.name}`}
            className="header__hero-img"
          />
        </div>
        <div className="heading-box">
          <h1 className="heading-primary">
            <span>{`${tour.name} tour`}</span>
          </h1>
          <div className="heading-box__group">
            <div className="heading-box__detail">
              <svg className="heading-box__icon">
                <use xlinkHref="/img/icons.svg#icon-clock" />
              </svg>
              <span className="heading-box__text">{`${tour.duration} days`}</span>
            </div>
            <div className="heading-box__detail">
              <svg className="heading-box__icon">
                <use xlinkHref="/img/icons.svg#icon-map-pin" />
              </svg>
              <span className="heading-box__text">{tour.startLocation.description}</span>
            </div>
          </div>
        </div>
      </section>
      <section className="section-description">
        <div className="overview-box">
          <div>
            <div className="overview-box__group">
              <h2 className="heading-secondary ma-bt-lg">Quick facts</h2>
              <OverviewBox
                label="Next date"
                text={new Date(tour.startDates[0]).toLocaleString('en-us', {
                  month: 'long',
                  year: 'numeric',
                })}
                icon="calendar"
              />
              <OverviewBox label="Difficulty" text={tour.difficulty} icon="trending-up" />
              <OverviewBox label="Participants" text={`${tour.maxGroupSize} people`} icon="user" />
              <OverviewBox label="Rating" text={`${tour.ratingsAverage} / 5`} icon="star" />
            </div>
            <div className="overview-box__group">
              <h2 className="heading-secondary ma-bt-lg">Your tour guides</h2>
              {tour.guides.map((guide) => (
                <div className="overview-box__detail" key={guide.id}>
                  <img
                    src={`/img/users/${guide.photo}`}
                    alt={`${guide.name}`}
                    className="overview-box__img"
                  />
                  {guide.role === 'lead-guide' && (
                    <span className="overview-box__label">Lead guide</span>
                  )}
                  {guide.role === 'guide' && (
                    <span className="overview-box__label">Tour guide</span>
                  )}
                  <span className="overview-box__text">{guide.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="description-box">
          <h2 className="heading-secondary ma-bt-lg">About {tour.name} tour</h2>
          {tour.description.split('\n').map((p, idx) => (
            <p className="description__text" key={idx}>
              {p}
            </p>
          ))}
        </div>
      </section>
      <section className="section-pictures">
        {tour.images.map((img, idx) => (
          <div className="picture-box" key={idx}>
            <img
              src={`/img/tours/${img}`}
              alt={`The Park Camper Tour ${idx + 1}`}
              className={`picture-box__img picture-box__img--${idx + 1}`}
            />
          </div>
        ))}
      </section>
      <section className="section-map">
        <div id="map" ref={mapContainer}></div>
      </section>
      <section className="section-reviews">
        <div className="reviews">
          {tour.reviews.map((review) => (
            <ReviewCard review={review} key={review.id} />
          ))}
        </div>
      </section>
      <section className="section-cta">
        <div className="cta">
          <div className="cta__img cta__img--logo">
            <img src="/img/logo-white.png" alt="Natours logo" />
          </div>
          <img
            src={`/img/tours/${tour.images[1]}`}
            alt="Tour pic"
            className="cta__img cta__img--1"
          />
          <img
            src={`/img/tours/${tour.images[2]}`}
            alt="Tour pic"
            className="cta__img cta__img--2"
          />
          <div className="cta__content">
            <h2 className="heading-secondary">What are you waiting for?</h2>
            <p className="cta__text">{`${tour.duration} days. 1 adventure. Infinite memories. Make it yours today!`}</p>
          </div>
          {props.rsAuth.user ? (
            <button
              className="btn btn--green span-all-rows"
              id="book-tour"
              data-tour-id={`${tour.id}`}
            >
              Book tour now!
            </button>
          ) : (
            <Link to="/login" className="btn btn--green span-all-rows">
              Log in to book tour
            </Link>
          )}
        </div>
      </section>
    </>
  );
};

export default connector(TourSlug);
