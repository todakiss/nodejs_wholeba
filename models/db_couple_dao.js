/**
 * Created by ProgrammingPearls on 15. 5. 4..
 */
var sql = require('./db_sql');

//커플 요청 시, couple 테이블에서 couple 생성
function insertMakeCouple (conn, data, done) {
  var datas = [data.auth_phone];
  conn.query(sql.insertMakeCouple, datas, function (err, row) {
    //console.log('updateCoupleIs_row', row);
    if (err) {
      done(err);
    } else if (row.affectedRows == 0) {
      done('정상적으로 생성되지 않았습니다.');
    } else {
      done(null, row.insertId);
    }
  });
}

//커플 요청 시, 요청 user의 user_gender, couple_no 업데이트
function updateUserGenderandCoupleNoandUserReq (conn, data, insertId, done) {
  console.log('insertId', insertId);
  var datas = [data.user_gender, insertId, data.user_no];
  conn.query(sql.updateUserGenderandCoupleNoandUserReq, datas, function (err, row) {
    //console.log('updateUserGender_row', row);
    if (err) {
      done(err);
    } else if (row.affectedRows == 0) {
      done('정상적으로 업데이트 되지 않았습니다.');
    } else {
      done(null, insertId);
    }
  });
}


function selectCheckAnswerCouple (conn, data, done){
  var datas = [data.user_no];
  conn.query(sql.selectCheckAnswerCouple, datas, function (err, row) {
    if (err) {
      done(err);
    } else {
      console.log('answer row', row);
      if (!row[0]) {
        done("당신은 승인자가 아닙니다..");
      }else{
        done(null, row[0].couple_no);
      }
    }
  });
}

function updateCoupleIs(conn, couple_no, done) {
  // couple_no에 couple_is 1로 변경
  var datas = [couple_no];
  conn.query(sql.updateCoupleIs, datas, function (err, row) {
    if (err) {
      done(err);
    } else if (row.affectedRows == 0) {
      done('정상적으로 업데이트 되지 않았습니다.');
    } else {
      done(null, couple_no);
    }
  });
}

function updateUserCoupleNoandGenderandUserReq(conn, couple_no, other_gender, data, done) {
  // user_no에 couple_no를 변경
  var datas = [couple_no, other_gender, data.user_no];
  conn.query(sql.updateUserCoupleNoandGenderandUserReq, datas, function (err, row) {
    //console.log('updateUserGender_row', row);
    if (err) {
      done(err);
    } else if (row.affectedRows == 0) {
      done('정상적으로 업데이트 되지 않았습니다.');
    } else {
      var result = {couple_no : couple_no, other_gender : other_gender, user_req :0};
      done(null, result);
    }
  });
}

function selectOtherGender(conn, couple_no, data, done) {
  var datas = [couple_no, data.user_no];
  conn.query(sql.selectOtherGender, datas, function (err, row) {
    //console.log('updateCoupleIs_row', row);
    if (err) {
      done(err);
    } else {
      console.log('other gender', row);
      if (!row[0]) {
        done("성별 조회 실패");
      }else{
        done(null, couple_no, row[0].other_gender);
      }
    }
  });
}

function selectCoupleInfo(conn, data, done) {
  var datas = [data.couple_no];
  conn.query(sql.selectCoupleInfo, datas, function (err, row) {
    console.log('selectCoupleInfo_row', row);
    if (err) {
      done(err);
    } else {
      //console.log('selectCoupleInfo row', row);
      if (!row[0]) {
        done("couple 정보를 불러오는데에 실패했습니다.");
      }else{
        done(null, row[0]);
      }
    }
  });
}

function mycondition(conn, data, done) {
  var datas = [data.condition_no,data.user_no];

  conn.query(sql.updateMyCondition, datas, function (err, row) {
    if (err) {
      done(err);
    } else {
      console.log('row', row);
      if(!row.affectedRows==1){
        done('내 기분 업데이트를 실패했습니다.');
      } else {
        done(null, row.changedRows);
      }
    }
  });
}

//
//function insertMakeDday(coupleNo, data, done) {
//  // dday 테이블에 dday 추가
//  pool.getConnection(function (err, conn) {
//    if (err) {
//      console.log('connection err', err);
//      done(err);
//      return;
//    }
//    var couple_no = data.couple_no || coupleNo;
//    var dday_name = data.dday_name || '처음 만난 날';
//    var dday_date = data.dday_date || data.couple_birth;
//    var dday_repeat = data.repeat || 0;
//
//    var datas = [couple_no, dday_name, dday_repeat];
//    console.log('datas datas', datas);
//    conn.query(sql.insertMakeDday, datas, function (err, row) {
//      console.log('updateUserGender_row', row);
//      if (err) {
//        done(err);
//      } else if (row.affectedRows == 0) {
//        done('정상적으로 생성되지 않았습니다.');
//      } else {
//        done(null, row.insertId);
//      }
//      conn.release();
//    });
//  });
//}

exports.insertMakeCouple = insertMakeCouple;
exports.updateUserGenderandCoupleNoandUserReq = updateUserGenderandCoupleNoandUserReq;

exports.selectCheckAnswerCouple = selectCheckAnswerCouple;
exports.updateCoupleIs = updateCoupleIs;
exports.updateUserCoupleNoandGenderandUserReq = updateUserCoupleNoandGenderandUserReq;
exports.selectOtherGender = selectOtherGender;

exports.selectCoupleInfo = selectCoupleInfo;
exports.mycondition = mycondition;






// 나중에 dday때 사용
//exports.insertMakeDday = insertMakeDday;


