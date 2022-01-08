import React from 'react';
import { useEffect, useState, useLayoutEffect } from 'react';
import '../App.scss';
import { updateWebSocket, timestr, datetimeExpanded } from '../util';

function FoodInfo (props) {

    const [food, setFood] = useState([]);

    function updateFood() {
        fetch('/api/components/dining-density/food').then(function (r) {r.json().then(function (d) {
            setFood(d.data.data);
            console.log(d.data.data);
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
        <div className="panel food shadow" style={{gridArea: "food"}}>
            <div className="food-container">
                <svg class="food-box shadow" viewBox="0 0 100% 160">
                    <foreignObject x="0" y="0" width="100%" height="100%" class = "fit">
                        <table class = "fit">
                            <thead>                   
                                <tr>
                                    <th>Name</th>
                                    <th>Occupancy</th>
                                    <th>% Full</th>
                                </tr>
                            </thead>
                            <tbody class = "vmove">
                                {food.map(function (v) {
                                    return (<tr>
                                        <td>
                                            {v['name']}
                                        </td>
                                        <td>
                                            {v['count']}
                                        </td>
                                        <td>
                                            {v['pct_full']}
                                        </td>
                                    </tr>);
                                })}
                            </tbody>
                        </table>
                    </foreignObject>
                </svg>
            </div>
        </div>
    )
}

export default FoodInfo;