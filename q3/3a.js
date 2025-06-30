function Student(usn, subCode, subName, cieMarks, seeMarks) {
  return  function getDetails() {
    return {
      usn,
      subCode,
      subName,
      totalMarks: cieMarks + seeMarks
    };
  }
};
const s1 = Student("1JS22CS001", "CS101", "Math", 45, 50);
console.log(s1());