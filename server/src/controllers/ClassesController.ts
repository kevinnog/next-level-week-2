import { Request, Response } from "express";

import db from "../database/connection";
import convertHoursToMinutes from "../utils/convertHoursToMinutes";

interface ScheduleItem {
  week_day: number;
  from: string;
  to: string;
}

export default class ClassesController {
  async index(request: Request, response: Response) {
    const filters = request.query;

    if (!filters.week_day || !filters.subject || !filters.time) {
      return response.status(400).json({
        error: "Missing filters to search classes",
      });
    }

    const timeInMinutes = convertHoursToMinutes(filters.time as string);

    console.log(timeInMinutes);

    return response.send();
  }

  async create(request: Request, response: Response) {
    const { name, avatar, whatsapp, bio, subject, cost, schedule } = request.body;

    const trx = await db.transaction();

    try {
      const insertedUsersIds = await trx("users").insert(
        {
          name,
          avatar,
          whatsapp,
          bio,
        },
        "id"
      );

      const user_id = insertedUsersIds[0];

      const insertedClassesIds = await trx("classes").insert(
        {
          subject,
          cost,
          user_id,
        },
        "id"
      );

      const class_id = insertedClassesIds[0];

      const classShedule = schedule.map((scheduleItem: ScheduleItem) => {
        return {
          class_id,
          week_day: scheduleItem.week_day,
          from: convertHoursToMinutes(scheduleItem.from),
          to: convertHoursToMinutes(scheduleItem.to),
        };
      });

      await trx("class_schedule").insert(classShedule);

      await trx.commit();

      return response.status(201).send();
    } catch (error) {
      await trx.rollback();

      return response.status(400).json({
        error: "Unexpected error while creating new class",
      });
    }
  }
}