import React, { useLayoutEffect, useState } from 'react';
import axios, { AxiosError } from 'axios';

import serverApi from '~/api/server-api';

import { TourInterface } from '~/api/types';
import ErrorPage from './_Error';
import Loading from '~/components/Loading';
import Overview from '~/components/Overview';
import { RouteComponentProps } from 'react-router';

type Props = RouteComponentProps;

const MyTours: React.FC<Props> = () => {
  const [tours, setTours] = useState<TourInterface[]>([]);
  const [toursError, setToursError] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useLayoutEffect(() => {
    setLoading(() => true);
    (async () => {
      try {
        const toursResult = await serverApi.get<{
          data: { tours: TourInterface[] };
          meta: { status?: number };
        }>('/api/v1/tours/my-tours');
        setTours(() => toursResult.data.data.tours);
        setLoading(() => false);
      } catch (err) {
        if (axios.isAxiosError(err)) {
          setToursError(() => (err as AxiosError).message);
        }
        setLoading(() => false);
      }
    })();
    return () => {
      setToursError(null);
    };
  }, []);

  if (loading) {
    return <Loading />;
  }

  if (toursError || !tours) {
    return <ErrorPage msg={toursError} />;
  }

  return <Overview tours={tours} />;
};

export default MyTours;
