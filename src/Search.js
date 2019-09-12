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
      setResults([]);
    } else {
      (async () => {
        const response = await fetch(url(6, searchTerms.trim()));
        const json = await response.json();
        if (!cancel) {
          setResults(json.results.docs);
        }
      })().catch(err => console.error(err));
    }

    return () => {
      cancel = true;
    };
  }, [searchTerms]);

  return (
    <>
      <label htmlFor="search">
        <p>Pick-up Location</p>
        <div className="Search-input">
          <input type="text" id="search" autoFocus placeholder={placeholderText} onChange={onChange} value={searchTerms} />
          {!!results.length && (
            <ol className="Search-results">
              {results.map((doc, i) => (
                <li key={`${i}`}>{doc.name}</li>
              ))}
            </ol>
          )}
        </div>
      </label>
    </>
  );
}

export default Search;
