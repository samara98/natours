import React, { useLayoutEffect, useState } from 'react';
import axios, { AxiosError } from 'axios';

import serverApi from '~/api/server-api';

import { TourInterface } from '~/api/types';
import ErrorPage from './_Error';
import Loading from '~/components/Loading';
import Overview from '~/components/Overview';

const Home: React.FC = () => {
  const [tours, setTours] = useState<TourInterface[]>([]);
  const [toursError, setToursError] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useLayoutEffect(() => {
    setLoading(() => true);
    (async () => {
      try {
        const toursResult = await serverApi.get<{
          data: TourInterface[];
          meta: { status?: number };
        }>('/api/v1/tours');
        setTours(() => toursResult.data.data);
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

export default Home;
