import http from 'k6/http';
import { sleep, check } from 'k6';
import { Counter } from 'k6/metrics';

export const request = new Counter('http_reqs');

export const options = {
  vus: 100, // simulate how many virtual users
  duration: '20s', // how long you want it to run
};

const productIdOptions = [1, 288748, 577496, 2598730, 2887478, 3176225, 5197459, 5486207, 5774955];
const productId = productIdOptions[1];
const urlReviews = `http://localhost:3300/reviews?product_id=${productId}`;
const urlRevMeta = `http://localhost:3300/reviews/meta?product_id=${productId}`;

// Below randomize the endpoints
export default function () {
  const res = http.get(urlReviews);
  // const res = http.get(urlRevMeta);
  sleep(1);
  check(res, {
    'is status 200': (r) => r.status === 200,
    'transaction time < 200ms': (r) => r.timings.duration < 200,
    'transaction time < 500ms': (r) => r.timings.duration < 500,
    'transaction time < 1000ms': (r) => r.timings.duration < 1000,
    'transaction time < 2000ms': (r) => r.timings.duration < 2000,
    'transaction time > 2000ms': (r) => r.timings.duration > 2000,
  });
}
