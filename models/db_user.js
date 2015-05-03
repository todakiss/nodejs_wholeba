var mysql = require('mysql');
var db_config = require('./db_config');
var async = require('async');

var pool = mysql.createPool(db_config);
var sql = "";
var params = [];

/*
 * 회원가입
 * 내 번호가 이미 커플의 인증번호에 있으면 커플을 이어주고 유저생성,
 * 없으면 새로운 커플과 유저를 생성
 * 1. count(couple의 auth_phone == user_phone)
 * 2. insert into couple -> 3. insert into user
 * 2. or update couple -> 3. insert into user
 * data = [user_id, user_pw, user_phone, user_regid]
 */
exports.join = function (data, callback) {
  async.waterfall([
      function (done) {
        checkAuthPhone(data, done);
      },
      function (arg1, done) {
        getCoupleNo(data, arg1, done);
      },
      function (arg2, done) {
        insertUser(arg2, done);
      }],
    function (err, result) {
      if (err) {
        console.log('err', err);
        callback(err, null);
      } else {
        console.log('result', result);
        callback(null, result);
      }
    });
};

/*
 * 가입정보조회
 * 해당 사용자가 커플 요청을 한사람인지, 받은 사람인지의 여부
 * + 받은사람이라면 상대의 휴대폰 번호를 같이 리턴
 * data = [user_no, user_no, user_no]
 */

exports.join_info = function (data, callback) {
  pool.getConnection(function (err, conn) {
    if (err) {
      console.log('connection err', err);
      callback(err, null);
    }
    sql = 'select distinct (select user_req from user where user_no=?) as user_req, (select user_phone from user where couple_no in (select couple_no from user where user_no=?) and not(user_no = ?) )as phone from user;';
    conn.query(sql, data, function (err, row) {
      if (err) callback(err, null);
      //console.log('row', row[0]);
      conn.release();
      callback(null, row[0]);
    });
  });
};

/*
 * 공통정보등록
 * 1.user_req = 0 이면 생일만
 * 2.user_req = 1 이면 사귄날과 생일
 * data = [user_no, couple_birth, user_birth]
 */
exports.common = function (data, callback) {
  async.waterfall([
      function (done) {
        selectUserReq(data, done);
      },
      function (arg1, done) {
        updateBirth(data, arg1, done);
      }],
    function (err, result) {
      if (err) {
        console.log('err', err);
        callback(err, null);
      } else {
        console.log('result', result);
        callback(null, result);
      }
    });
};

//여성정보등록
exports.woman = function (period, syndormes, pills, callback) {
  var success = 1;
  callback(success);
};

/*
 * 로그인
 * user_id와 user_pw 비교하여 로그인
 * + user_phone과 user_regid가 달라졌을경우 update
 * users.js에서 세션 저장
 * data = [user_id, user_pw, user_phone, user_regid]
 */
exports.login = function (data, callback) {
  async.waterfall([
    function (done) {
      doLogin(data, done);
    },
    function (arg, done) {
      updateUserInfo(data, arg, done);
    }],
    function (err, result) {
      if (err) {
        //console.log('err', err);
        callback(err, null);
      } else {
        //console.log('result', result);
        callback(null, result);
      }
    });
};

/*
 * 사용자기본값조회
 * user_no, couple_no, gender, condom(피임여부) 를 리턴
 * 남자 사용자의 경우 커플 상대(여자)의 기본 피임여부값을 리턴
 */
exports.userinfo = function (data, callback) {
  pool.getConnection(function(err, conn) {
    if(err) callback(err, null);
    else {
      sql = "select user_no, couple_no, user_gender, (select user_condom from user where couple_no in (select couple_no from user where user_no=?)and user_gender='f') as user_condom from user where user_no = ?;";
      conn.query(sql, data, function(err, row) {
        if(err) callback(err, null);
        else {
          console.log('userinfo : ', row);
          callback(null, row[0]);
          conn.release();
        }
      });
    }
  });
};

//로그아웃
exports.logout = function (data, callback) {
  var success = 1;
  callback(success);
};

//회원탈퇴
exports.withdraw = function (data, callback) {
  var success = 1;
  callback(success);
};


//check auth_phone
function checkAuthPhone(data, done) {
  pool.getConnection(function (err, conn) {
    if (err) console.log('err', err);
    else {
      //auth_phone에 user_phone이 있는지 없는지 확인
      //있을 경우의 user insert를 위해 couple_no도 조회한다
      sql = 'select couple_no, count(*) as cnt from couple where auth_phone=? and couple_is = 0;';
      conn.query(sql, [data[2]], function (err, row) {
        if (err) {
          console.log('err', err);
          done(err, null);
        } else {
          console.log('row', row[0]);
          conn.release();
          done(null, row[0]);
        }
      });
    }
  });
}

//get couple_no
function getCoupleNo(data, arg1, done) {

  var user_req = 1;

  pool.getConnection(function (err, conn) {
    if (err) console.log('connection err', err);
    else {
      // auth_phone이 없으므로 couple 생성으로 couple_no를 얻는다
      if (arg1.cnt == 0) {
        sql = 'insert into couple values();';
        conn.query(sql, [], function (err, row) {
          if (err) {
            console.log('err', err);
            done(err, null);
            conn.release();
          } else {
            console.log('row', row);
            data.push(row.insertId);  //새로 생성된 couple_no 넣기
            data.push(user_req);  //커플 요청자
            conn.release();
            done(null, data);
          }
        });
      }
      // auth_phone이 있으므로 있는 couple_no를 갖다씀
      else {
        if (arg1.couple_no) {
          //console.log('null', null);
          user_req = 0;
          data.push(arg1.couple_no);   //기존에 존재하던 couple_no 넣기
          data.push(user_req);         //커플승인자
          done(null, data);
          conn.release();
        } else {
          console.log('arg1.couple_no', arg1.couple_no);
          conn.release();
          done('couple_no undefined', null);
        }
      }
    }
  });
}

//insert user
function insertUser(arg2, done) {
  pool.getConnection(function (err, conn) {
    if (err) console.log('connection err : ', err);
    sql = 'insert into user(user_id, user_pw, user_phone, user_regid, couple_no, user_req) values(?, ?, ?, ?, ?, ?)';
    conn.query(sql, arg2, function (err, row) {
      if (err) done(err, null);
      row.couple_no = arg2[4];  //couple_no 넘겨주기
      conn.release();
      done(null, row);
    });
  });
}

//selectUserReq
function selectUserReq(data, done) {
  pool.getConnection(function (err, conn) {
    if (err) callback(err, null);
    else {
      sql = 'select user_req from user where user_no=?';
      conn.query(sql, [data[0]], function (err, row) {
        if (err) callback(err, null);
        else {
          //console.log('select user_req : ', row);
          conn.release();
          done(null, row[0]);
        }
      });
    }
  });
}

//update couple_birth, user_birth
function updateBirth(data, arg, done) {
  pool.getConnection(function (err, conn) {
    if (err) done(err, null);
    else {
      //user_req = 1 이면 커플요청자이므로 사귄날 update
      //그 후에 user_birth update
      if (arg.user_req = 1) {
        sql = 'update couple set couple_birth=? where couple_no in (select couple_no from user where user_no = ?);';
        params = [data[1], data[0]];
        conn.query(sql, params, function (err, row) {
          if (err) done(err, null);
          else updateUserBirth(data, done);
        });
      }
      //user_req = 0이면 커플요청받은사람 이므로 생일만 update
      else {
        updateUserBirth(data, done);
      }
    }
    conn.release();
  });
}

//update user_birth
function updateUserBirth(data, done) {
  pool.getConnection(function (err, conn) {
    if (err) done(err, null);
    else {
      sql = 'update user set user_birth=? where user_no=?';
      params = [data[2], data[0]];
      conn.query(sql, params, function (err, row) {
        if (err) done(err, null);
        else {
          //console.log('update user birth : ', row);
          done(null, row);
          conn.release();
        }
      });
    }
  });
}

//login
function doLogin(data, done) {
  pool.getConnection(function(err, conn) {
    if(err) done(err, null);
    else {
      sql = 'select user_no, couple_no, user_phone, user_regid, count(*) as cnt from user where user_id=? and user_pw=?';
      params = [data[0], data[1]];
      conn.query(sql, params, function(err, row) {
        if(err) done(err, null);
        else {
          //console.log('do login : ', row[0]);
          if(row[0].cnt == 1) {
            done(null, row[0]);
            conn.release();
          } else done('login error', null);
        }
      });
    }
  });
}


//사용자의 전화번호와 gcm id가 변경되면 갱신
function updateUserInfo(data, arg, done) {
  if(data[2] == arg.user_phone && data[3] == arg.user_regid) {
    //기존것과 같으면 바꿀필요 없이 break;
    done(null, arg);
  }
  //달라졌을 경우 db에 update 한다
  else {
    pool.getConnection(function(err, conn) {
      if(err) done(err, null);
      else {
        //gcm 아이디가 다를경우
        if(data[3] != arg.user_regid) {
          pool.getConnection(function(err, conn) {
            if(err) done(err, null);
            else {
              sql = 'update user set user_regid=? where user_no=?;';
              params = [data[3], arg.user_no];
              conn.query(sql, params, function(err, row) {
                if(err) done(err, null);
                else {
                  console.log('update user_regid : ', row);
                  //전화번호도 달라졌을 경우
                  if(data[2] != arg.user_phone) {
                    updateUserPhone(data, arg, done);
                  }
                  //gcmid만 달라졌을 경우 break
                  else {
                    done(null, arg);
                  }
                }
              });  //gcm id update
            }
            conn.release();
          });  //get connection
        }
        // 전화번호만 다를경우
        else {
          updateUserPhone(data, arg, done);
        }
      }
    });
  }
}

//user_phone이 달라졌을 경우 갱신
//data : 입력값, arg : 기존값
function updateUserPhone(data, arg, done) {
  pool.getConnection(function(err, conn) {
    if(err) done(err, null);
    else {
      sql = 'update user set user_phone=? where user_no=?';
      params = [data[2], arg.user_no];
      conn.query(sql, params, function(err, row) {
        if(err) done(err, null);
        else {
          console.log('update user_phone : ', row);
          done(null, arg);
          conn.release();
        }
      });
    }
  });
}