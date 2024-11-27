import MyPage from "./MyPage";
import BackgroundGradient from '../components/BackgroundGradient'
import React, { useEffect, useState } from 'react'

function index() {

  const [error, setError] = useState(2)

  const [color, setColor] = useState<'blue' | 'green' | 'red'| 'purple' | 'other'>('purple')

  useEffect(() => {
    if (error === 1) {
      setColor('green')
      setTimeout(() => {
        setError(2);
      }, 2000)
    } else if (error === 0) {
      setColor('red')
      setTimeout(() => {
        setError(2);
      }, 2000)
    } else if (error === 2) {
      setColor('purple')
    }
    else {
        setColor('other')
    }
  }, [error])

  return (
    <div className="p-4 mb-4 mx-8">
        <BackgroundGradient className="bg-cta-background rounded-2xl" color={color}>
            <MyPage setError={setError} />
        </BackgroundGradient>
    </div>
  )
}

export default index