import { SearchBar } from './SearchBar/SearchBar';
import { ImageGallery } from './ImageGallery/ImageGallery';
import { Button } from './Button/Button';
import { MagnifyingGlass } from 'react-loader-spinner';
import { Modal } from './Modal/Modal';
import { useState } from 'react';
import { useEffect } from 'react';
import axios from 'axios';

export const App = () => {
  const [search, setSearch] = useState('');
  const [results, setResults] = useState([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalImg, setModalImg] = useState('');
  const [totalHits, setTotalHits] = useState(0);

  const getNormalizeImages = images =>
    images.map(({ id, webformatURL, largeImageURL }) => ({
      id,
      webformatURL,
      largeImageURL,
    }));

  useEffect(() => {
    if (!search) {
      return;
    }
    const controller = new AbortController();
    setIsLoading(true);
    async function fetchData(search, page) {
      axios.defaults.baseURL = 'https://pixabay.com/api';
      const API_KEY = '30059252-fce911be355cbdd889b3b7d8d';
      const params = {
        q: search.split(' ').join('+'),
        page,
        key: API_KEY,
        image_type: 'photo',
        orientation: 'horizontal',
        per_page: 12,
      };
      try {
        const response = await axios.get('/', {
          params,
          signal: controller.signal,
        });
        const results = getNormalizeImages(response.data.hits);

        setResults(prev => [...prev, ...results]);
        setTotalHits(response.data.totalHits);
      } catch (error) {
        console.log(error.message);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData(search, page);

    return () => {
      controller.abort();
    };
  }, [page, search]);

  const showModalWindow = link => {
    setModalImg(link);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const onSubmitSearch = search => {
    setPage(1);
    setSearch(search);
    setResults([]);
  };

  const loadMore = () => {
    setPage(prev => prev + 1);
  };

  return (
    <>
      <SearchBar onSubmit={onSubmitSearch} />
      {showModal && <Modal imageLink={modalImg} closeModal={closeModal} />}
      {isLoading && page === 1 && (
        <MagnifyingGlass
          visible={true}
          height="80"
          width="80"
          ariaLabel="MagnifyingGlass-loading"
          wrapperStyle={{}}
          wrapperClass="MagnifyingGlass-wrapper"
          glassColor="#c0efff"
          color="#e15b64"
        />
      )}
      {isLoading && page > 1 && (
        <>
          <ImageGallery images={results} openModal={showModalWindow} />
          <MagnifyingGlass
            visible={true}
            height="80"
            width="80"
            ariaLabel="MagnifyingGlass-loading"
            wrapperStyle={{}}
            wrapperClass="MagnifyingGlass-wrapper"
            glassColor="#c0efff"
            color="#e15b64"
          />
        </>
      )}
      {!isLoading && results.length > 0 && (
        <>
          <ImageGallery images={results} openModal={showModalWindow} />
          {results.length < totalHits && <Button onLoadMore={loadMore} />}
        </>
      )}
    </>
  );
};
