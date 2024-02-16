import {useEffect, useState} from "react";
import {fetchAsync} from "../../component/fetch.ts";

const API_KEY = "";

type Root = {
  snappedPoints: Array<{
    location: {
      latitude: number
      longitude: number
    }
    originalIndex: number
    placeId: string
  }>
}

const GoogleMapAPI = () => {
  const [roads, setRoads] = useState<Root>();
  
  const nearestRoads = async () => {
    const result = await fetchAsync({
      url: `https://roads.googleapis.com/v1/nearestRoads?points=60.170880%2C24.942795%7C60.170879%2C24.942796%7C60.170877%2C24.942796&key=${API_KEY}`,
      options: {}
    });
    setRoads(JSON.parse(result));
  }
  
  // 制限速度を取得したい
  const speedLimits = async () => {
    const result = await fetchAsync({
      url: `https://roads.googleapis.com/v1/speedLimits?placeId=ChIJX12duJAwGQ0Ra0d4Oi4jOGE&placeId=ChIJLQcticc0GQ0RoiNZJVa5GxU&key=${API_KEY}`,
      options: {}
    });
    console.log(result)
  }
  
  useEffect(() => {
    nearestRoads()
  }, []);
  
  useEffect(() => {
    speedLimits()
  }, [roads]);
  
  console.log(roads)
  
  return (
    <></>
  );
};

export default GoogleMapAPI