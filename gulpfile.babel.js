'use strict';

import gulp from 'gulp';
import babel from 'gulp-babel';
import nodemon from 'gulp-nodemon';
import eslint from 'gulp-eslint';
import mocha from 'gulp-mocha';

gulp.task('test', () => {
  process.env.NODE_ENV = 'test';
  gulp.src(['test/**/*.js'], { read: false })
    .pipe(mocha({
      reporter: 'spec',
      timeout: 2000,
    }))
    .once('error', () => {
      process.exit(1);
    })
    .once('end', () => {
      process.exit();
    });
});

gulp.task('lint', () => {
  gulp.src(['server/**/*.js'])
    .pipe(eslint())
    .pipe(eslint.format())
    .on('error', (error) => {
      console.log('Stream Exiting With Error: ', error.message);
    });
});

gulp.task('nodemon', () => {
  nodemon({
    script: './server/index.js',
    execMap: {
      js: 'node_modules/babel-cli/bin/babel-node.js',
    },
    ext: 'js html',
    env: {
      NODE_ENV: 'development',
    },
    tasks: ['lint'],
  });
});

gulp.task('release', () => {
  gulp.src('server/**/*.js')
    .pipe(babel({
      presets: ['es2015'],
    }))
    .pipe(gulp.dest('dist'));
});

gulp.task('default', ['lint', 'nodemon'], () => {
});
