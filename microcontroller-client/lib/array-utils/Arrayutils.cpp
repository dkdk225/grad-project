#include "Arrayutils.h"

int ArrayUtils::getArrSize(char* arr){
  int i = 0;
  while (arr[i] != '\0') {
    i++;
  }
  return i;
}

char *ArrayUtils::concat(char *arr1, char *arr2){
  int size1 = getArrSize(arr1);
  int size2 = getArrSize(arr2);
  char *result = new char[size1+size2];
  for (int i = 0; i < size1; ++i) {
    result[i] = arr1[i];
  }

  for (int i = 0; i < size2; ++i) {
    result[size1 + i] = arr2[i];
  }
  result[size1 + size2] = '\0';
  return result;
};