import React from 'react'
import PropTypes from 'prop-types'

import SidebarPage from '../../components/sidebar/sidebar-page'
import Section from '../../components/common/section'
import Card from '../../components/common/card'

import IconAirPollution from './icons/air-pollution.svg'
import IconNoise from './icons/noise.svg'

export default class DetailssPage extends React.Component {
  getLngLat = () => {
    // Get the longitude and latitude from the URL
    let params = new URLSearchParams(this.props.location.search.slice(1))
    return { lng: params.get('lng'), lat: params.get('lat') }
  }

  componentWillMount () {
    // Set the radius at click point
    this.props.setRadius(this.getLngLat())
  }

  componentWillReceiveProps (nextProps) {
    // Check circle pollution averages has changed, if so get new air quality index
    if (this.props.circleAverages !== nextProps.circleAverages) {
      nextProps.getAirQualityIndex(nextProps.circleAverages.NO2, nextProps.circleAverages.PM25, nextProps.circleAverages.PM10, false)
    }
  }

  componentDidUpdate (prevProps) {
    // If the location changed (new coordinates), update the radius
    if (prevProps.location !== this.props.location) {
      this.props.setRadius(this.getLngLat())
      this.props.getAirQualityIndex(this.props.circleAverages.NO2, this.props.circleAverages.PM10, this.props.circleAverages.PM25)
    }
  }

  componentWillUnmount () {
    // Remove the radius
    this.props.setRadius(null)
  }

  render () {
    return (
      <SidebarPage title='Details' canGoBack>
        <Section title='Map Location'>
          <Card>
            <h1>Longitude:</h1>
            {this.getLngLat().lng}
            <h1>Latitude:</h1>
            {this.getLngLat().lat}
          </Card>
        </Section>
        <Section title='Area 24 Hour Averages'>
          <Card>
            <div className='average'>
              <IconAirPollution className='icon' />
              <div className='details'>
                <h1>Air Pollution</h1>
                <span className='value'>{this.props.airQualityIndexSub}</span>
              </div>
            </div>
            <div className='pill-container'>
              <div className='pill'>
                <h2>NO2</h2>
                <span>{this.props.circleAverages.NO2} µg/m³</span>
              </div>
              <div className='pill'>
                <h2>PM2.5</h2>
                <span>{this.props.circleAverages.PM25} µg/m³</span>
              </div>
              <div className='pill'>
                <h2>PM10</h2>
                <span>{this.props.circleAverages.PM10} µg/m³</span>
              </div>
            </div>
          </Card>
          <Card className='average' link={``}>
            <IconNoise className='icon' />
            <div className='details'>
              <h1>Noise</h1>
              <span className='value'>{this.props.circleAverages.dB} dB</span>
            </div>
          </Card>
        </Section>
      </SidebarPage>
    )
  }
}

DetailssPage.propTypes = {
  location: PropTypes.object,
  setRadius: PropTypes.func,
  circleAverages: PropTypes.object,
  getAirQualityIndex: PropTypes.func,
  airQualityIndexSub: PropTypes.string
}
