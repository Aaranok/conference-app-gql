const { SQLDataSource } = require('../../utils/sqlDataSource')

class ConferenceDB extends SQLDataSource {
  generateWhereClause(queryBuilder, filters = {}) {
    const { startDate, endDate, organizerEmail } = filters
    if (startDate) queryBuilder.andWhere('StartDate', '>=', startDate)
    if (endDate) queryBuilder.andWhere('StartDate', '<=', endDate)
    if (organizerEmail) queryBuilder.andWhere('organizerEmail', '=', organizerEmail)
  }
  async getConferenceList(pager, filters) {
    const { page, pageSize } = pager
    const values = await this.knex
      .select('Id', 'Name', 'ConferenceTypeId', 'LocationId', 'CategoryId', 'StartDate', 'EndDate')
      .from('Conference')
      .modify(this.generateWhereClause, filters)
      .orderBy('Id')
      .offset(page * pageSize)
      .limit(pageSize)
    return { values }
  }
  async getConferenceById(id) {
    const result = await this.knex
      .select('Id', 'Name', 'ConferenceTypeId', 'LocationId', 'CategoryId', 'StartDate', 'EndDate')
      .from('Conference')
      .where('Id', id)
      .first()
    return result
  }

  async getConferenceListTotalCount(filters) {
    return await this.knex('Conference').count('Id', { as: 'TotalCount' }).modify(this.generateWhereClause, filters).first()
  }

  async updateConferenceXAttendee({ attendeeEmail, conferenceId, statusId }) {
    const existing = await this.knex
      .select('Id', 'AttendeeEmail', 'ConferenceId')
      .from('ConferenceXAttendee')
      .where('AttendeeEmail', attendeeEmail)
      .andWhere('ConferenceId', conferenceId)
      .first()
    const updateAttendee = { AttendeeEmail: attendeeEmail, ConferenceId: conferenceId, StatusId: statusId }
    let result
    if (existing?.id) {
      result = await this.knex('ConferenceXAttendee').update(updateAttendee, 'StatusId').where('Id', existing.id)
    } else {
      result = await this.knex('ConferenceXAttendee').returning('StatusId').insert(updateAttendee)
    }
    return result[0]
  }
}

module.exports = ConferenceDB
