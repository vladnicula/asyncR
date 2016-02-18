import {expect} from 'chai';
import sinon from 'sinon';
import asyncR from '../src'

describe('Resource Manager', () => {

	let asyncOp, asyncOpSpy, resourceValue = 'blank';

	beforeEach( () => {
		// simulate a 250ms long operation
		asyncOp = function () {
			return new Promise( (resolve, reject) => {
				setTimeout( () => {
					resolve(resourceValue)
				}, 250);
			});
		}

		asyncOpSpy = sinon.spy(asyncOp);
	});

	describe('Basic resource registration', () => {

		it('Should wrap async operations into resource object', () => {
			let basicResource = asyncR(asyncOpSpy);
			expect(basicResource).to.be.a('object');
			expect(basicResource.get).to.be.a('function');
			expect(basicResource.clear).to.be.a('function');
			expect(basicResource.whenCleared).to.be.a('function');
		});

		it('Should get resource as promise', () => {
			let basicResource = asyncR(asyncOpSpy);
			expect(basicResource.get()).to.be.instanceOf(Promise);
		});

		it ('Should get the result of the async opertaion in resource', (done) => {
			let resourceR = asyncR(asyncOpSpy);
			resourceR.get().then((resrouceResult) => {
				expect(resrouceResult).to.equal(resourceValue);
				done();
			});
		});

	});

	describe('Multiple calls to resource', function () {

		it('Should call asyncOp only once', () => {

			let resource = asyncR(asyncOpSpy);

			let resourceAccessRequests = [
				resource.get(),
				resource.get(),
				resource.get()
			]

			expect(asyncOpSpy.callCount).to.equal(1);
		});

		it('Should have access to resource in each call', (done) => {

			let resource = asyncR(asyncOpSpy);

			let resourceAccessRequests = [
				resource.get(),
				resource.get(),
				resource.get()
			]

			Promise.all(resourceAccessRequests)
				.then( (results) => {
					let [r1,r2,r3] = results;
					expect(r1).to.equal(resourceValue);
					expect(r2).to.equal(resourceValue);
					expect(r3).to.equal(resourceValue);
					expect(asyncOpSpy.callCount).to.equal(1);
					done();
				})
				.catch(done);
		});
	});

	describe('Resource invalidation', function () {

		it ('Should be able to register and call invalidation callback', (done) => {
			let resource = asyncR(asyncOpSpy);

			let invalidateCb = sinon.spy();

			resource.whenCleared(invalidateCb);

			resource.clear().then( () => {
				expect(invalidateCb.callCount).to.equal(1);
			});

			done();
		});

		it('Should call invalidate only after resource has been loaded', (done) => {
			let resource = asyncR(asyncOpSpy);

			let invalidateCb = sinon.spy();

			resource.whenCleared(invalidateCb);

			let promise = resource.get();

			resource.clear();

			// clear needs to be called before we add a .then to the
			// promise, otherwise this .then will run first before the
			// .then registered in the clear
			promise
				.then( () => {
					expect(invalidateCb.callCount).to.equal(1);	
					done();
				})
				.catch(done);

			expect(invalidateCb.callCount).to.equal(0);
			
		});
	});

	describe('Resource clear on done', function (done) {
		it('Should automatically clear items when created with clearWhenDone options', (done) => {
			let resource = asyncR(asyncOpSpy, {clearOnDone:true});

			resource.get();
			resource.get()
				.then( () => {
					return resource.get();
				})
				.then( () => {
					expect(asyncOpSpy.callCount).to.equal(2);
					done()
				})
				.catch(done);
		});
	});


});










