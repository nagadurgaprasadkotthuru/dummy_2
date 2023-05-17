import {Component} from 'react'
import Loader from 'react-loader-spinner'
import {BsSearch} from 'react-icons/bs'
import {FcGenericSortingAsc, FcGenericSortingDesc} from 'react-icons/fc'

import Header from '../Header'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  inProgress: 'IN_PROGRESS',
  failure: 'FAILURE',
}

const nationalStats = {
  activeCases: 0,
  confirmedCases: 0,
  recoveredCases: 0,
  deceasedCases: 0,
}

export default class Home extends Component {
  state = {apiStatus: apiStatusConstants.success, stats: ''}

  componentDidMount() {
    this.getDate()
  }

  getDate = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const requestUrl = 'https://apis.ccbp.in/covid19-state-wise-data'
    const response = await fetch(requestUrl)
    const data = await response.json()
    console.log(data)
    if (response.ok) {
      const {statesList} = this.props
      const updatedData = statesList.map(eachState => {
        const stateCode = eachState.state_code
        const state = data[stateCode]
        const {total} = state
        const {confirmed, recovered, deceased} = total
        const active = confirmed - (recovered + deceased)
        nationalStats.confirmedCases += confirmed
        nationalStats.recoveredCases += recovered
        nationalStats.deceasedCases += deceased
        total.active = active
        return state
      })
      nationalStats.activeCases =
        nationalStats.confirmedCases -
        (nationalStats.recoveredCases + nationalStats.deceasedCases)
      this.setState({stats: updatedData, apiStatus: apiStatusConstants.success})
    }
  }

  getStateListElement = state => {
    const {total} = state
    const {active, recovered, deceased, confirmed, tested} = total
    return (
      <li className="state-list-element">
        <h1>Balu</h1>
      </li>
    )
  }

  renderNationalStats = () => (
    <ul className="national-stats-container">
      <li className="national-stats-list-element">
        <h4 className="confirmed-heading">Confirmed</h4>
        <img
          className="image"
          alt="logo"
          src="https://res.cloudinary.com/dfddyuqkb/image/upload/v1684333471/check-mark_1_1x_sm_e9wxjd.png"
        />
        <p className="confirmed-count">{nationalStats.confirmedCases}</p>
      </li>
      <li className="national-stats-list-element">
        <h4 className="confirmed-heading">Active</h4>
        <img
          className="image"
          alt="logo"
          src="https://res.cloudinary.com/dfddyuqkb/image/upload/v1684333508/protection_2_1x_sm_exkepc.png"
        />
        <p className="confirmed-count">{nationalStats.activeCases}</p>
      </li>
      <li className="national-stats-list-element">
        <h4 className="confirmed-heading">Recovered</h4>
        <img
          className="image"
          alt="logo"
          src="https://res.cloudinary.com/dfddyuqkb/image/upload/v1684333495/recovered_1_1x_sm_osgwaq.png"
        />
        <p className="confirmed-count">{nationalStats.recoveredCases}</p>
      </li>
      <li className="national-stats-list-element">
        <h4 className="confirmed-heading">Deceased</h4>
        <img
          className="image"
          alt="logo"
          src="https://res.cloudinary.com/dfddyuqkb/image/upload/v1684333483/breathing_1_1x_sm_giojfp.png"
        />
        <p className="confirmed-count">{nationalStats.deceasedCases}</p>
      </li>
    </ul>
  )

  renderStateStatsView = () => {
    const {stats} = this.state
    return (
      <ul className="states-table-container">
        <li className="table-header-list-element">
          <div className="states/ut-heading-icons-container">
            <h3 className="states/ut">States/UT</h3>
            <button
              className="ascending-button"
              type="button"
              data-testid="ascendingSort"
            >
              <FcGenericSortingAsc className="sorting-icon" />
            </button>
            <button
              className="descending-button"
              type="button"
              data-testid="descendingSort"
            >
              <FcGenericSortingDesc className="sorting-icon" />
            </button>
          </div>
        </li>
      </ul>
    )
  }

  renderSuccessView = () => (
    <div className="home-content-container">
      <div className="search-icon-element-container">
        <BsSearch className="search-icon" />
        <input
          className="search-element"
          type="search"
          placeholder="Enter the State"
        />
        {this.renderNationalStats()}
        {this.renderStateStatsView()}
      </div>
    </div>
  )

  renderLoaderView = () => (
    <div data-testid="loader" className="loader-container">
      <Loader type="Oval" color="#007bff" height="32px" width="32px" />
    </div>
  )

  renderSwitchView = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderSuccessView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoaderView()
      default:
        return null
    }
  }

  render() {
    return (
      <div className="home-bg-container">
        <Header />
        {this.renderSwitchView()}
      </div>
    )
  }
}
