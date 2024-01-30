## Features

1. Home Page (Infinite Scrolling Fetching)
2. Explore Page
3. Search
4. User Profile
5. Likes post
6. Save post
7. Photo Upload
8. Users Page
9. User Profile Edit - Not yet
10. User Profile Follow system - Not yet
11. Comments - Not yet

## Some Bugs

- When use save post from Explore page, this error because of caching system in react-query, i will fix it soon.

- when you save post again from Home page and Explore page (twice), it will be saved twice, i will fix it soon.

- window.location.reload() is not good for production, i will fix it soon.
  - use instead `navigate('/sign-in'})`
