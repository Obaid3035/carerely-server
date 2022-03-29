import { Service } from "typedi";
import BaseService from "./base.service";
import Queries from "../entities/Queries";
import Topic from "../entities/Topic";
import NotFound from "../utils/errorCode";
import Answer from "../entities/Answer";

@Service()
class QueriesService extends BaseService<Queries> {
  constructor() {
    super(Queries);
  }

  async indexTopic() {
    const topic = await Topic.createQueryBuilder("topic")
      .getMany()
    return topic
  }

  async createAnswer(queriesId: string, userId: number, userInput: Answer) {
    const queries = await Queries.findOne(queriesId);
    if (!queries) {
      throw new NotFound("Topic not found")
    }
    const answer = Answer.create({
      queries: queries,
      text: userInput.text,
      user_id: userId
    })
    await answer.save();
    return await Answer.createQueryBuilder("answers")

      .select([
        "answers.id",
        "answers.text",
        "user.id",
        "user.user_name",
      ])
      .where("answers.id = :id", { id: answer.id })
      .innerJoin("answers.user", "user")
      .orderBy("answers.created_at", "ASC")
      .getOne()
  }

  async index(topicId: string) {
    const queries = await Queries.createQueryBuilder("queries")

      .select([
        "queries.id",
        "queries.text",
        "user.id",
        "user.user_name",
      ])
      .where("queries.topic_id = :id", { id: topicId })
      .loadRelationCountAndMap("queries.answerCount", "queries.answer")
      .innerJoin("queries.user", "user")
      .orderBy("queries.created_at", "ASC")
      .getMany()
    return queries;
  }

  async create(topicId: string, userId: number, userInput: Queries) {
    const topic = await Topic.findOne(topicId);
    if (!topic) {
      throw new NotFound("Topic not found")
    }
    const queries = Queries.create({
      topic: topic,
      text: userInput.text,
      user_id: userId
    });

    await queries.save();

    return await Queries.createQueryBuilder("queries")

      .select([
        "queries.id",
        "queries.text",
        "user.id",
        "user.user_name",
      ])
      .where("queries.id = :id", { id: queries.id })
      .loadRelationCountAndMap("queries.answerCount", "queries.answer")
      .innerJoin("queries.user", "user")
      .getOne()
  }

  async createTopic(userInput: Topic) {
    const topic = Topic.create({
      text: userInput.text
    })
    await topic.save();
    return {
      saved: true
    }
  }

  async indexAnswers(queriesId: string) {
    const answers = await Answer.createQueryBuilder("answers")

      .select([
        "answers.id",
        "answers.text",
        "user.id",
        "user.user_name",
      ])
      .where("answers.queries_id = :id", { id: queriesId })
      .innerJoin("answers.user", "user")
      .orderBy("answers.created_at", "ASC")
      .getMany()

    return answers
  }

}

export default QueriesService;
