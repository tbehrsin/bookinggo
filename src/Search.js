import React, { useState, useEffect } from 'react';

export const url = (count, terms) => `https://www.rentalcars.com/FTSAutocomplete.do?solrIndex=fts_en&solrRows=${count}&solrTerm=${terms}`;
export const placeholderText = 'city, airport, station, region and district...';

const Search = () => {
  const [searchTerms, setSearchTerms] = useState('');
  const [results, setResults] = useState([]);

  const onChange = (event) => {
    setSearchTerms(event.target.value);
  };

  useEffect(() => {
    let cancel = false;

    if (searchTerms.trim().length < 2) {
      // set an empty results list if 1 or fewer alphanumeric characters are
      // entered
      setResults([]);
    } else {
      (async () => {
        // by default we want 6 results according to the spec
        const response = await fetch(url(6, searchTerms.trim()));
        const json = await response.json();

        // if the query is cancelled then don't update the results list, it will
        // be updated by the next run of this effect or if the component is
        // unmounted then there's no need for a results list
        if (!cancel) {
          setResults(json.results.docs);
        }
      })().catch(() => {
        // set an empty results list if there is an error in the solr query
        setResults([]);
      });
    }

    return () => {
      // if the effect is re-rendered or unmounted then cancel the query leading
      // to a no-op for this effect, see above
      cancel = true;
    };
  }, [searchTerms]);

  return (
    <>
      <label htmlFor="search">
        <p>Pick-up Location</p>
        <div className="Search-input">
          <input
            type="text"
            id="search"
            autoFocus
            placeholder={placeholderText}
            onChange={onChange}
            value={searchTerms}
          />
          {!!results.length && (
            <ol className="Search-results">
              {results.map((doc, i) => (
                // here we're using an array index, ideally we'd have a unique
                // id returned by the solr index for each document
                <li key={`${i}`}>{doc.name}</li>
              ))}
            </ol>
          )}
        </div>
      </label>
    </>
  );
};

export default Search;
