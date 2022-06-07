import App from "./app";
import UserController from "./controller/user.controller";
import AdminUserController from "./controller/admin/user.controller";
import FriendShipController from "./controller/friendShip.controller";
import PostController from "./controller/post.controller";
import LikeController from "./controller/like.controller";
import CommentController from "./controller/comment.controller";
import QueriesController from "./controller/queries.controller";
import AdminBlogController from "./controller/admin/blog.controller";
import BlogController from "./controller/blog.controller";
import ProfileController from "./controller/profile.controller";
import CalorieController from "./controller/calorie.controller";
import ConversationController from "./controller/conversation.controller";
import MessageController from "./controller/message.controller";

new App([
  new UserController(),
  new AdminUserController(),
  new FriendShipController(),
  new PostController(),
  new LikeController(),
  new CommentController(),
  new QueriesController(),
  new AdminBlogController(),
  new BlogController(),
  new ProfileController(),
  new CalorieController(),
  new ConversationController(),
  new MessageController()
]).bootstrap();



//1. Can I restate the problem in my own words?
// 2. What are the inputs that go into the problems?
// [1,2,3], [2,3,4]
// 3. What are the outputs that should come from the solution to the problem?
// true, false
// 4. Can the output be determined by the inputs.?
// Yes
// 5. How should I label important pieces of data that are part of the problem?


//function: takes two array args
//check if both array must have same length
//loop over first array


//function same(arr1: number[], arr2: number[]) {
//   let frequencyCounter1: any = {};
//   let frequencyCounter2: any = {}
//   for (const val of arr1) {
//     frequencyCounter1[val] = (frequencyCounter1[val] || 0) + 1
//   }
//
//   for (const val of arr2) {
//     frequencyCounter2[val] = (frequencyCounter2[val] || 0) + 1
//   }
//
//   for (const key in frequencyCounter1) {
//     if (!(String((parseInt(key) ** 2)) in frequencyCounter2)) {
//       return false
//     }
//     if (frequencyCounter2[String(parseInt(key ) ** 2)] !== frequencyCounter1[key]) {
//       return false
//     }
//   }
//   return  true
// }

//1. Can I restate the problem in my own words?
// 2. What are the inputs that go into the problems?
// "cenima", "iceman"
// 3. What are the outputs that should come from the solution to the problem?
// true, false
// 4. Can the output be determined by the inputs.?
// Yes
// 5. How should I label important pieces of data that are part of the problem?


// Anagram
// take two objects
//loop over both the object and construct string counter
//

// function anagaram(str1: string, str2: string) {
//   let frequencyCounter1: any = {}
//   let frequencyCounter2: any = {}
//
//   for (const val of str1) {
//     frequencyCounter1[val] = (frequencyCounter1[val] || 0) + 1
//   }
//
//   for (const val of str2) {
//     frequencyCounter2[val] = (frequencyCounter2[val] || 0) + 1
//   }
//
//   for (const key in frequencyCounter1) {
//     if (!(key in frequencyCounter2)) {
//       return false
//     }
//     console.log(frequencyCounter1[key], frequencyCounter2[key])
//     if (frequencyCounter1[key] !== frequencyCounter2[key]) {
//       return false
//     }
//
//   }
//   return true
// }
//
// console.log(anagaram("iceman ", "cenima"))


// function countUniqueValue(arr: number[]) {
//   let i = 0;
//   let j = 1;
//   while (j < arr.length) {
//     if (arr[i] === arr[j]) {
//       j++;
//     } else {
//       i++
//       arr[i] = arr[j]
//     }
//   }
//   return i + 1
// }
//
// console.log(countUniqueValue([1,1,1,1,1,1,2,2,3,4,5,9,0]))










