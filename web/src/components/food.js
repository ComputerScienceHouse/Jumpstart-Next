import React from 'react';
import { useEffect, useState, useLayoutEffect } from 'react';
import '../App.scss';
import { updateWebSocket, timestr, datetimeExpanded } from '../util';

function FoodInfo (props) {

    const [food, setFood] = useState([]);

    function updateFood() {
        fetch('/api/components/dining-density/food').then(function (r) {r.json().then(function (d) {
            setFood(d.data);
            console.log(d.data);
        })});
    }
    function wsListener(e) {
        console.log(e);
        updateFood();
    }
    useEffect(function () {
        updateWebSocket.addEventListener('dining-density.food', wsListener);
        return () => updateWebSocket.removeEventListener('dining-density.food', wsListener);
    });
    useEffect(function () {
        updateFood();
    }, []);
    return (
        <div className="dining-density food" style={{gridArea: "food"}}>
            <div className="food-container">
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Occupancy</th>
                            <th>% Full</th>
                        </tr>
                    </thead>
                    <tbody> 
                        <tr>
                            <td>
                                {food[0]['name']}
                            </td>
                            <td>
                                {food[0]['count']}
                            </td>
                            <td>
                                {food[0]['pct_full']}
                            </td>
                        </tr>
                        <tr>
                            <td>
                                {food[1]['name']}
                            </td>
                            <td>
                                {food[1]['count']}
                            </td>
                            <td>
                                {food[1]['pct_full']}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default FoodInfo;