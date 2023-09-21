import React, { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useDebouncedCallback } from 'use-debounce';

import axiosHelper from '../utils/axiosHelper';
import { API_ENDPOINTS } from '../config/apiUrl';
import ReactTable from '../components/common/ReactTable';
import Loader from '../components/common/Loader';
import AppModal from '../components/common/AppModal';

const usCountryId = 226;
const companyId = 560;

export const Home = () => {
  const columns = [
    {
      Header: "Id",
      accessor: "id",
      Cell: (cellValues) => {
        let contactItem = cellValues.row.original;
        return (
          <span className='clickable' onClick={() => {
            setIsItemDetailModalOpen(true);
            setCurrentOnViewItem(contactItem)
          }}>{contactItem.id}</span>
        );
      },
    },
    {
      Header: "Email",
      accessor: "email",
    },
    {
      Header: 'Phone Number',
      accessor: "phone_number",
    },
  ];
  const [currentOnViewItem, setCurrentOnViewItem] = useState(null);
  const [areContactsFromEvenId, setAreContactsFromEvenId] = useState(false);
  const [isItemListModalOpen, setIsItemListModalOpen] = useState(false);
  const [isItemDetailModalOpen, setIsItemDetailModalOpen] = useState(false);
  const [currentModalId, setCurrentModalId] = useState("modal_a");
  const [contactsList, setContactsList] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchKeyWord, setSearchKeyWord] = useState("")
  const debouncedSearchKeyWord = useDebouncedCallback(
    // function
    (value) => {
      setSearchKeyWord(value);
    },
    // delay in ms
    500
  );
  const navigate = useNavigate();
  let modalId = searchParams.get("mid");

  const getContacts = async (params) => {
    let { modalId, query, page } = params;
    let queryString = `?companyId=${companyId}`;

    if (query) {
      queryString = `${queryString}&query=${query}`
    }
    if (page) {
      queryString = `${queryString}&page=${page}`
    }
    if (modalId === "modal_b") {
      queryString = `${queryString}&countryId=${usCountryId}`
    }
    try {
      const response = await axiosHelper.get(`${API_ENDPOINTS.contacts}${queryString}`);
      let contacts = Object.values(response.contacts);
      setContactsList(contacts);
    } catch (error) {
    }
  }

  useEffect(() => {
    if (modalId) {
      setCurrentModalId(modalId);
      getContacts({ modalId, page: currentPage }); // Get the contacts data from api
      if (modalId === "modal_a" && document.querySelector(".allCountries")) {
        document.querySelector(".allCountries").click();
      }
      if (modalId === "modal_b" && document.querySelector(".usCountries")) {
        document.querySelector(".usCountries").click();
      }
    }
  }, [currentModalId]);

  useEffect(() => {
    if (areContactsFromEvenId) {
      filterEvenContacts(contactsList);
    } else {
      if (contactsList.length) {
        getContacts({ modalId, page: 1 }); // Get the contacts data from api
      }
    }
  }, [areContactsFromEvenId]);

  useEffect(() => {
    getContacts({ modalId, query: searchKeyWord, page: 1 })
  }, [searchKeyWord]);


  function isScrolledToBottom(selector) {
    const content = document.querySelector(selector);

    // Calculate the current scroll position and height of the content
    const scrollTop = content.scrollTop;
    const scrollHeight = content.scrollHeight;
    const clientHeight = content.clientHeight;

    // Check if the user has scrolled to the bottom
    return scrollTop + clientHeight >= scrollHeight;
  }

  const checkScrollTop = (selector) => {
    // Event listener to detect scroll
    document.querySelector(selector).addEventListener("scroll", function () {
      if (isScrolledToBottom(selector)) {
        // Action to perform for infinity loading
      }
    });
  }

  const clearElementEvents = (selector, eventName, boundFunction) => {
    document.querySelector(selector).removeEventListener(eventName, boundFunction);
  }

  useEffect(() => {
    checkScrollTop(".allContacts");
    checkScrollTop(".usContacts");

    return () => {
      clearElementEvents(".allContacts", "scroll", isScrolledToBottom);
      clearElementEvents(".usContacts", "scroll", isScrolledToBottom);
    };
  }, [])

  const filterEvenContacts = (contactsList) => {
    // let contacts = Object.values(dummyData.contacts);
    let evenOnly = contactsList.filter(contact => contact.id % 2 === 0);
    setContactsList(evenOnly);
  }

  return (
    <div className='homeWrapper'>
      <button
        type="button"
        className="btn btn-primary mr-20 allCountries"
        data-bs-toggle="modal"
        data-bs-target="#modal_a_all_countries"
        onClick={() => navigate("/?mid=modal_a")}
        style={{ backgroundColor: "#46139f" }}
      >
        Button A
      </button>
      <button
        type="button"
        className="btn btn-primary usCountries"
        data-bs-toggle="modal"
        data-bs-target="#modal_b_us_countries"
        onClick={() => navigate("/?mid=modal_b")}
        style={{ backgroundColor: "#ff7f50" }}
      >
        Button B
      </button>
      <AppModal
        isModalOpen={isItemListModalOpen}
        modalId="modal_a_all_countries"
        onClose={() => {
          setIsItemListModalOpen(false);
          setSearchKeyWord("")
        }}
        extraClasses="modal-lg"
      >
        <>
          <div className='topBar'>
            <button
              type="button"
              className="btn btn-primary mr-20"
              onClick={() => { navigate("/?mid=modal_a"); window.location.reload() }}
              style={{ backgroundColor: "#46139f" }}
            >
              All Contacts
            </button>
            <button
              type="button"
              className="btn btn-primary mr-20"
              onClick={() => { navigate("/?mid=modal_b"); window.location.reload() }}
              style={{ backgroundColor: "#ff7f50" }}
            >
              US Contacts
            </button>
            <button
              type="button"
              className="btn btn-danger"
              data-bs-dismiss="modal"
              style={{ backgroundColor: "#fff", border: "2px solid #46139f", color: "#000" }}
              onClick={() => {
                navigate("/");
                window.location.reload()
                setIsItemListModalOpen(false)
              }}
            >
              Close
            </button>
          </div>
          <h2>All Contacts</h2>
          <div className='tableContent allContacts'>
            <input type="text"
              onChange={(e) => {
                debouncedSearchKeyWord(e.target.value)
              }}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  setSearchKeyWord(e.target.value);
                }
              }}
            />
            {
              contactsList.length > 0 ? (
                <>
                  <ReactTable
                    columns={columns}
                    data={contactsList}
                    // globalSearch={true}
                    rowsPerPage={rowsPerPage}
                  />
                </>
              )
                :
                <Loader />
            }
          </div>
          <div className='footer text-start'>
            <input
              id="allContactsOnlyEven"
              className="form-check-input"
              type="checkbox"
              value={areContactsFromEvenId}
              checked={areContactsFromEvenId}
              onChange={() => { setAreContactsFromEvenId(!areContactsFromEvenId) }}
            />
            <label className="form-check-label" htmlFor="allContactsOnlyEven">
              Only even
            </label>
          </div>
        </>
      </AppModal>
      <AppModal
        isModalOpen={isItemListModalOpen}
        modalId="modal_b_us_countries"
        onClose={() => {
          setIsItemListModalOpen(false);
          setSearchKeyWord("")
        }}
        extraClasses="modal-lg"
      >
        <>
          <div className='topBar'>
            <button
              type="button"
              className="btn btn-primary mr-20"
              onClick={() => { navigate("/?mid=modal_a"); window.location.reload() }}
              style={{ backgroundColor: "#46139f" }}
            >
              All Contacts
            </button>
            <button
              type="button"
              className="btn btn-primary mr-20"
              onClick={() => { navigate("/?mid=modal_b"); window.location.reload() }}
              style={{ backgroundColor: "#ff7f50" }}
            >
              US Contacts
            </button>
            <button
              type="button"
              className="btn btn-danger"
              data-bs-dismiss="modal"
              style={{ backgroundColor: "#fff", border: "2px solid #46139f", color: "#000" }}
              onClick={() => {
                navigate("/");
                window.location.reload();
                setIsItemListModalOpen(false)
              }}
            >
              Close
            </button>
          </div>
          <h2>US Contacts</h2>
          <div className='tableContent usContacts'>
            <input type="text"
              onChange={(e) => {
                debouncedSearchKeyWord(e.target.value)
              }}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  setSearchKeyWord(e.target.value);
                }
              }}
            />
            {
              contactsList.length > 0 ? (
                <>
                  <ReactTable
                    columns={columns}
                    data={contactsList}
                    // globalSearch={true}
                    rowsPerPage={rowsPerPage}
                  />
                </>
              )
                :
                <Loader />
            }
          </div>
          <div className='footer text-start'>
            <input
              id="usContactsOnlyEven"
              className="form-check-input"
              type="checkbox"
              value={areContactsFromEvenId}
              checked={areContactsFromEvenId}
              onChange={() => { setAreContactsFromEvenId(!areContactsFromEvenId) }}
            />
            <label className="form-check-label" htmlFor="usContactsOnlyEven">
              Only even
            </label>
          </div>
        </>
      </AppModal>
      <AppModal
        isModalOpen={isItemDetailModalOpen}
        modalId="item_details_modal"
        onClose={() => {
          setIsItemDetailModalOpen(false)
        }}
        extraClasses="modal-lg"
      >
        <button onClick={() => setIsItemDetailModalOpen(false)}>Close</button>
        <div>Email : {currentOnViewItem?.email}</div>
        <div>Phone Number :{currentOnViewItem?.phone_number}</div>
      </AppModal>
    </div>
  )
}
