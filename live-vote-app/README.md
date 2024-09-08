## The App

> This project is not safe to deploy on, don't deploy it on production it is only developed to show case skill's and should be considered in learning purpose only.

Objective Content Voting: an app for voting on your favorite movies, songs, programming languages, and more through head-to-head matchups, with real-time leaderboards, user profiles, and social sharing.

-   Separate Voting UI for mobile devices and web browsers, enabling users to conveniently cast votes on the go
-   Results UI optimized for large screens like projectors, showcasing real-time voting outcomes in an engaging visual format
-   Diverse Content Categories including movies, songs, programming languages, books, TV shows, and more
-   Matchup Voting System presenting two pieces of content side-by-side for easy comparison and selection
-   Real-time Leaderboards updated continuously based on collective user votes
-   User Profiles to track individual voting history and compare preferences with other users
-   Social Sharing functionality to involve friends and spread the voting excitement
-   Offline Voting Capability with automatic synchronization when reconnected to the internet

## The Architecture

The Objective Content Voting system is composed of two main applications:

### 1. **Browser Application**

-   **Framework**: Built using **React**, this application will provide both the Voting UI and the Results UI.
-   **Functionality**: Users can easily access the voting interface on mobile devices or any web browser, while the results interface is optimized for larger screens, such as projectors.

### 2. **Server Application**

-   **Framework**: Developed with **Node.js**, this application will manage the core voting logic.
-   **Responsibilities**: It will handle vote submissions, tally results, and manage user sessions.

### Communication

-   **WebSockets**: The two applications will communicate in real-time using WebSockets, ensuring that votes are processed instantly and results are updated live on the Results UI.

This architecture allows for a seamless and interactive voting experience, combining a responsive front-end with a robust back-end to deliver real-time updates and maintain user engagement.

State tree of our voting app might be.
![image](assets/vote_server_tree_entries.png)

# Project setup

```bash
cd voting-server
npm i
```

> there is conflicting version with chai, chai-immutable so please use as chai@3.5.0 and chai-immutable@1.5.3

> Redux is most often associated with React applications, but it really isn't limited to that use case. Part of what we're going to learn is how useful Redux can be in other contexts as well!

### Thanks

[teropa](https://teropa.info/blog/2015/09/10/full-stack-redux-tutorial#what-you-will-need)
