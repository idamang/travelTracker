import db from '../db';
import { Sequelize } from 'sequelize';

describe('Database Initialization', () => {
  it('should initialize Sequelize instance correctly', () => {
    expect(db.sequelize).toBeInstanceOf(Sequelize);
    expect(db.sequelize.getDialect()).toBe('mysql');
  });

  it('should define all models', () => {
    expect(db.User).toBeDefined();
    expect(db.Map).toBeDefined();
    expect(db.Country).toBeDefined();
    expect(db.Travel).toBeDefined();
    expect(db.Rating).toBeDefined();
    expect(db.Comment).toBeDefined();
  });

  it('should establish correct model relationships', () => {
    const userAssociations = Object.keys(db.User.associations);
    const countryAssociations = Object.keys(db.Country.associations);

    expect(userAssociations).toContain('country');
    expect(userAssociations).toContain('userRatings');
    expect(userAssociations).toContain('userTravels');
    expect(userAssociations).toContain('userComments');

    expect(countryAssociations).toContain('users');
    expect(countryAssociations).toContain('countryRatings');
    expect(countryAssociations).toContain('comments');
  });
});
