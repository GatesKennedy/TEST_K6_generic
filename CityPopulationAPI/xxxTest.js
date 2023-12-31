import http from 'k6/http';
import { check, sleep } from 'k6';
import { urlAPI, urlBASE } from '../globalDefs.js';
import { existingRecords, cityNames, stateNames } from '../cityStatePop.js';

// Generate Methods
function genRandoCity(cityNames) {
	const val = Math.floor(Math.random() * 100);
	console.log('cityVal: ', val);
	return cityNames[val];
}
function genRandoState(stateNames) {
	const val = Math.floor(Math.random() * 50);
	console.log('stateVal: ', val);
	return stateNames[val];
}
function genRandoEndPoint() {
	const valCity = Math.floor(Math.random() * 100);
	const valState = Math.floor(Math.random() * 50);

	return '/state/' + stateNames[valState] + '/city/' + cityNames[valCity];
}
function getExistingEndPoint() {
	const valExist = Math.floor(Math.random() * 335);
	const recExist = existingRecords[valExist];
	const result = [
		`/state/${recExist[1].replace(' ', '%20')}/city/${recExist[0].replace(
			' ',
			'%20',
		)}`,
		recExist[2],
	];
	return result;
}

export const options = {
	stages: [
		{ duration: '10s', target: 10 },
		{ duration: '10s', target: 1000 },
		{ duration: '10s', target: 1000 },
		{ duration: '10s', target: 10 },
	],
};
export default function () {
	const headers = { 'Content-Type': 'text/plain' };
	const randoEP = genRandoEndPoint();
	const randoPop = (Math.floor(Math.random() * 1000000) + 500000).toString();

	// GET 200
	const resGet = http.get(urlBASE + urlAPI + getExistingEndPoint()[0]);
	check(resGet, { 'status was 200': (r) => r.status == 200 });

	// // PUT 200
	// const putExists = getExistingEndPoint();
	// const resPut = http.put(urlBASE + urlAPI + putExists[0], putExists[1], {
	// 	headers: headers,
	// });
	// check(resPut, { 'status was 200': (r) => r.status == 200 });

	// // PUT 201
	// const resNew = http.put(urlBASE + urlAPI + randoEP, randoPop, {
	// 	headers: headers,
	// });
	// check(resNew, {
	// 	'rando creation GOOD': (r) => r.status == 201 || r.status == 200,
	// });
}
