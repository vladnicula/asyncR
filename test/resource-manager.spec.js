import {expect} from 'chai';
import sinon from 'sinon';
import asyncR from '../src'

describe('Resource Manager', () => {

	describe('Basic resource registration', () => {

		it('Should wrap resoruce into function', () => {
			let basicResource = asyncR(function () {
				return new Promise( (resolve, reject) => {
					resolve();
				})
			});
			expect(basicResource).to.be.a('function');
		});

		it('Should get resource as promise', () => {
			let basicResource = asyncR(function () {
				return new Promise( (resolve, reject) => {
					resolve();
				})
			});
			let resourcePromise = basicResource();
			expect(resourcePromise).to.be.instanceOf(Promise);
		});

		it ('Should get the result of the async opertaion in resource', () => {
			let resourceValue = 'Value of async opertaion';
			let asyncOperation = function () {
				return Promise.resolve(resourceValue)
			}
			let resourceR = asyncR(asyncOperation);
			resourceR().then((resrouceResult) => {
				expect(resrouceResult).to.equal(resourceValue);
			});
		});

	});

	describe('Multiple calls to resource', function () {

		let asyncOp, asyncOpSpy, resourceValue = 'blank';

		beforeEach( () => {
			// simulate a 500ms long operation
			asyncOp = function () {
				return new Promise( (resolve, reject) => {
					setTimeout( () => {
						resolve(resourceValue)
					}, 500);
				});
			}

			asyncOpSpy = sinon.spy(asyncOp);
		});

		it('Should call asyncOp only once', () => {

			let resource = asyncR(asyncOpSpy);

			let resourceAccessRequests = [
				resource(),
				resource(),
				resource()
			]

			expect(asyncOpSpy.callCount).to.equal(1);
		});

		it('Should have access to resource in each call', (done) => {

			let resource = asyncR(asyncOpSpy);

			let resourceAccessRequests = [
				resource(),
				resource(),
				resource()
			]

			expect(resource()).to.be.instanceOf(Promise);

			Promise.all(resourceAccessRequests)
				.then( (results) => {
					let [r1,r2,r3] = results;
					expect(r1).to.equal(resourceValue);
					expect(r2).to.equal(resourceValue);
					expect(r3).to.equal(resourceValue);
					done();
				})
				.catch( (err) => done(err) )
		});
	});


















});