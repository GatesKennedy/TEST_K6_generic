import http from 'k6/http';
import { check, sleep } from 'k6';
import { urlAPI, urlBASE } from '../globalDefs.js';
import { existingRecords, cityNames, stateNames } from '../cityStatePop.js';

// Generation Methods
function genRandoEndPoint() {
	const valCity = Math.floor(Math.random() * 100);
	const valState = Math.floor(Math.random() * 50);

	return (
		'/state/' +
		stateNames[valState].replace(' ', '%20') +
		'/city/' +
		cityNames[valCity].replace(' ', '%20')
	);
}
function genExistingEndPoint() {
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

//	K6 Definitions
export const options = {
	stages: [
		{ duration: '6s', target: 10 },
		{ duration: '30s', target: 800 },
		{ duration: '4m', target: 800 },
		{ duration: '30s', target: 10 },
		{ duration: '12s', target: 1 },
	],
};
export default function () {
	const headers = { 'Content-Type': 'text/plain' };
	const randoEP = genRandoEndPoint();
	const randoPop = (Math.floor(Math.random() * 1000000) + 500000).toString();

	// GET 200
	const resGet = http.get(urlBASE + urlAPI + genExistingEndPoint()[0]);
	check(resGet, { 'status was 200': (r) => r.status == 200 });

	if (Number(randoPop) % 2 == 0) {
		// PUT 200
		const putExists = genExistingEndPoint();
		const resPut = http.put(urlBASE + urlAPI + putExists[0], putExists[1], {
			headers: headers,
		});
		check(resPut, { 'update record was 200': (r) => r.status == 200 });
	} else {
		// PUT 201
		const resNew = http.put(urlBASE + urlAPI + randoEP, randoPop, {
			headers: headers,
		});
		check(resNew, {
			'create record was 201': (r) => r.status == 201 || r.status == 200,
		});
	}
}
